using Microsoft.Owin;
using Owin;

[assembly: OwinStartupAttribute(typeof(WebConference.Startup))]
namespace WebConference
{
    public partial class Startup
    {
        public void Configuration(IAppBuilder app)
        {
            ConfigureAuth(app);
        }
    }
}
