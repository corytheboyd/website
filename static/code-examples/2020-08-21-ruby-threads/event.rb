require 'minitest'

Event = Struct.new(:id, :sent_to_invitees, :should_log_override) do
    def self.build(id)
        new(id, false, nil)
    end
end

class TestEvent < Minitest::Test
    def test_it_builds_and_has_accessors
        event = Event.build('abc123')
        event.sent_to_invitees = true
        event.should_log_override = nil

        assert_equal('abc123', event.id)
        assert_equal(true, event.sent_to_invitees)
        assert_nil(event.should_log_override)
    end
end