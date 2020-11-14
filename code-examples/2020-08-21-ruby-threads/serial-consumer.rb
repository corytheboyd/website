require 'logger'

require_relative './event_data_client'
require_relative './event_delta_stream'

# Don't buffer output for the sake of example
STDOUT.sync = false

logger = Logger.new(STDOUT).tap do |l|
    l.progname = 'main'
end
data_client = EventDataClient.new(logger: logger)
event_delta_stream = EventDeltaStream.new(
    logger: logger,
    pages: 10,
    per_page: 100,
)

# When events are determined eligible for syncing, they will be pushed
# into this queue. This doesn't need to be a queue, you could just
# directly write to a job queue or something similar at this point.
sync_queue = Queue.new

buffer = []
drain = ->(buffer) do
    events = []
    while event = buffer.pop
        events.push(event)
    end

    all_data = []
    all_data += data_client.fetch_should_log(events)
    all_data += data_client.fetch_is_sent(events)
    
    # Track intermediate state of events as data fetch results arrive
    should_log_cache = {}
    is_sent_cache = {}

    all_data.each do |data|
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

event_delta_stream.each do |event|
    buffer << event
    if buffer.size == 20
        drain.call(buffer)
        buffer.clear
    end
end
unless buffer.empty?
    drain.call(buffer)
    buffer = nil
end

logger.info("events to sync: #{sync_queue.size}")