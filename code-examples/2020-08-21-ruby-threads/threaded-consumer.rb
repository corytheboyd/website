require 'logger'

require_relative './event_data_client'
require_relative './event_delta_stream'

# On by default in Ruby >= 2.5
Thread.abort_on_exception = true

# Don't buffer output for the sake of example
STDOUT.sync = false

logger = Logger.new(STDOUT).tap do |l|
    l.progname = 'main'
end
data_client = EventDataClient.new(logger: logger)
event_delta_stream = EventDeltaStream.new(
    logger: logger,
    pages: 10,
    per_page: 100
)

# Events returned from the delta API are pushed into this
# queue, which is consumed by the worker thread.
ingress_queue = Queue.new

# Additional data about events us pusehd into the queue as
# it is collected. It is processed in the data reducer
# thread.
reducer_queue = Queue.new

# When events are determined eligible for syncing, they will be pushed
# into this queue. This doesn't need to be a queue, you could just
# directly write to a job queue or something similar at this point.
sync_queue = Queue.new

ingress_thread = Thread.new do
    child_threads = []

    drain = ->(buffer) do
        events = []
        while event = buffer.pop
            events.push(event)
        end
        
        child_threads << Thread.new do
            results = data_client.fetch_should_log(events)
            results.each do |result|
                reducer_queue.push(result)
            end
        end

        child_threads << Thread.new do
            results = data_client.fetch_is_sent(events)
            results.each do |result|
                reducer_queue.push(result)
            end
        end
    end

    buffer = []
    while event = ingress_queue.pop
        buffer.push(event)
        
        if buffer.size == 20
            drain.call(buffer.dup)
            buffer.clear
        end
    end

    unless buffer.empty?
        drain.call(buffer.dup)
    end

    child_threads.each(&:join)
    reducer_queue.close
end

reducer_thread = Thread.new do
    # Track intermediate state of events as data fetch results arrive
    lock = Mutex.new
    should_log_cache = {}
    is_sent_cache = {}

    while data = reducer_queue.pop
        lock.synchronize do
            case data.type
            when EventDataClient::ResultType::SHOULD_LOG
                if data.value
                    should_log_cache[data.event_id] = true
                end

            when EventDataClient::ResultType::IS_SENT
                if data.value
                    is_sent_cache[data.event_id] = true
                end
            
            else
                raise "Unexpected data type: #{data.type}"
            end

            if should_log_cache[data.event_id] && is_sent_cache[data.event_id]
                should_log_cache.delete(data.event_id)
                is_sent_cache.delete(data.event_id)
                sync_queue.push(data.event_id)
            end
        end
    end
end

event_delta_stream.each do |event|
    ingress_queue.push(event)
end
logger.debug('delta stream exhausted')
ingress_queue.close

ingress_thread.join
logger.debug('event data fetch thread finished')

reducer_thread.join
logger.debug('reducer thread finished')

logger.info("events to sync: #{sync_queue.size}")