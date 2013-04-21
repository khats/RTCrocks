using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;

namespace WebConf
{
    public class Message
    {
        public string peerId { get; set; }
        public MessageType type { get; set; }
        public string description { get; set; }
        public int tryN { get; set; }
    }

    public class VideoHub : Hub
    {
        public static int Count { get; set; }
        public static int TryN { get; set; }
        public Task Open()
        {
            var peerId = "user" + Count;
            Count++;
            TryN++;
            return Clients.Others.OnMessage(new Message { type = MessageType.Join, peerId = peerId, tryN = TryN });
        }

        public Task Send(Message message)
        {
            TryN++;
            message.tryN = TryN;
            return Clients.Others.OnMessage(message);
        }
    }

    public enum MessageType
    {
        Join,
        Leave,
        Offer,
        Answer,
        Candidate
    }
}