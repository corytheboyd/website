require_relative './event'

require 'minitest'

# Contrived utility to simulate making batched requests for arbitrarily sized list
# of events, returning normalized results for the operations.
class EventDataClient
    module ResultType
        SHOULD_LOG = 0
        IS_SENT = 1
    end

    # Container for value of requested data type
    Data = Struct.new(:event_id, :type, :value)
    
    # Container for group of data with a get function for a specific event's data
    Response = Struct.new(:data) do
        # Naive O(N) implementation for the sake of example
        def get(id)
            data.find { |d| d.event_id == id }
        end
    end

    SHOULD_LOG = ->(event) do
        rand > 0.5
    end

    IS_SENT = ->(event) do
        rand > 0.5
    end

    BATCH_SIZE = 20

    def initialize(
        add_latency: true,
        batch_size: BATCH_SIZE,
        should_log: SHOULD_LOG,
        is_sent: IS_SENT,
        logger: nil
    )
        @add_latency = add_latency
        @is_sent = is_sent
        @should_log = should_log
        @logger = logger
    end

    def fetch_should_log(events)
        simulate_network_latency!
        events.map do |event|
            Data.new(
                event.id,
                ResultType::SHOULD_LOG,
                @should_log.call(event)
            )
        end
    end

    def fetch_is_sent(events)
        simulate_network_latency!
        events.map do |event|
            Data.new(
                event.id,
                ResultType::IS_SENT,
                @is_sent.call(event)
            )
        end
    end

    private

    def simulate_network_latency!
        return unless @add_latency
        # This API is fairly fast, 300~800ms
        value = rand(300...800)
        @logger&.debug(self.class) { "injecting simulated network latency: #{value}ms" }
        sleep(value / 1000.0)
    end
end

class EventDataClientTest < Minitest::Test
    def setup
        @client = BatchFetchEventData.new(
            add_latency: false,
            batch_size: 2,
            should_log: ->(event) do
                event.id % 2 == 0
            end,
            is_sent: ->(event) do
                event.id % 2 == 1
            end
        )
    end

    def test_it_executes_requests_and_returns_data
        events = [
            Event.new(1),
            Event.new(2),
            Event.new(3),
            Event.new(4),
            Event.new(5),
        ]
        should_log_results = @client.fetch_should_log(events)
        is_sent_results = @client.fetch_is_sent(events)

        assert_equal(false, should_log_results.get(1).value)
        assert_equal(true, should_log_results.get(2).value)
        assert_equal(false, should_log_results.get(3).value)
        assert_equal(true, should_log_results.get(4).value)
        assert_equal(false, should_log_results.get(5).value)

        assert_equal(true, is_sent_results.get(1).value)
        assert_equal(false, is_sent_results.get(2).value)
        assert_equal(true, is_sent_results.get(3).value)
        assert_equal(false, is_sent_results.get(4).value)
        assert_equal(true, is_sent_results.get(5).value)
    end
end
