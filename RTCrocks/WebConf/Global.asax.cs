﻿using System.Web.Mvc;
using System.Web.Optimization;
using System.Web.Routing;
using WebConf.App_Start;

namespace WebConf
{
    public class MvcApplication : System.Web.HttpApplication
    {
        protected void Application_Start()
        {
            AreaRegistration.RegisterAllAreas();

            RouteConfig.RegisterRoutes(RouteTable.Routes);
            BundleConfig.RegisterBundles(BundleTable.Bundles);
        }
    }
}