using System;
using System.Threading;
using Microsoft.Owin.Hosting;

namespace TaskTrackerApi
{
    class Program
    {
        private static readonly ManualResetEvent _shutdownEvent = new ManualResetEvent(false);

        static void Main(string[] args)
        {
            string baseAddress = "http://localhost:5000/";

            Console.WriteLine("====================================================");
            Console.WriteLine("  TaskTracker API (.NET Framework 4.7.2)");
            Console.WriteLine("====================================================");
            Console.WriteLine($"Starting server on: {baseAddress}");

            Console.CancelKeyPress += (sender, eventArgs) =>
            {
                eventArgs.Cancel = true;
                _shutdownEvent.Set();
            };

            using (WebApp.Start<Startup>(url: baseAddress))
            {
                Console.WriteLine($"Server is running at {baseAddress}");
                Console.WriteLine($"Test endpoint: {baseAddress}api/tasks");
                Console.WriteLine("Press Ctrl+C to stop the server...");

                _shutdownEvent.WaitOne();
            }

            Console.WriteLine("Server stopped.");
        }
    }
}
