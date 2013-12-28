using Microsoft.Owin;
using Owin;

[assembly: OwinStartup(typeof(WebConf.Startup))]
namespace WebConf
{
    public class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            app.MapSignalR();
        }
    }
}
