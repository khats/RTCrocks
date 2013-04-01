using System.Threading.Tasks;
using Microsoft.AspNet.SignalR;

namespace SignalRChat
{
    public class Messsage
    {
        public string Name { get; set; }
        public string Group { get; set; }
        public string Text { get; set; }
    }

    public class ChatHub : Hub
    {
        public Task Join(string groupName)
        {
            return Groups.Add(Context.ConnectionId,groupName);
        }

        public Task Send(Messsage message)
        {
            return Clients.Group(message.Group).addMessage(message);
        }
    }
}