require 'securerandom'
require 'minitest'

# Contrived example of a pagination stream
class EventDeltaStream
    include Enumerable

    def initialize(
        add_latency: true,
        pages: 10,
        per_page: 100,
        logger: nil
    )
        @add_latency = add_latency
        @pages = pages
        @per_page = per_page
        @logger = logger
    end

    # @yieldparam [Event] event
    def each
        while events = fetch_page
            events.each do |event|
                yield Event.build(event[:id])
            end
        end
    end

    private

    def fetch_page
        if @pages == 0
            return nil
        end
        simulate_network_latency!
        @pages -= 1
        @per_page.times.map do
            {
                id: SecureRandom.uuid,
            }
        end
    end

    def simulate_network_latency!
        return unless @add_latency
        # This API is fairly fast, 50~200ms
        value = rand(50...200)
        @logger&.debug(self.class) { "injecting simulated network latency: #{value}ms" }
        sleep(value / 1000.0)
    end
end

class EventDeltaStreamTest < MiniTest::Test
    def setup
        @pages = 3
        @per_page = 15
        @stream = EventDeltaStream.new(
            add_latency: false,
            pages: @pages,
            per_page: @per_page
        )
    end

    def test_paginates_through_all_events
        @count = 0
        @stream.each do
            @count += 1
        end
        assert_equal(@count, @pages * @per_page)
    end
end
