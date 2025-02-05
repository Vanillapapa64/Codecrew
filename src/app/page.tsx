import { Typewriter } from "./components/smooth";
import Signupbutton from './components/signupbutton'
export default async function Page() {
  const features = [
    {
      title: "Real-Time Repository Data",
      description:
        "Stay up to date with live updates from GitHub—no manual syncing required.",
    },
    {
      title: "Seamless Collaboration",
      description:
        "Work together with teammates effortlessly, track contributions, and manage projects with ease.",
    },
    {
      title: "Automatic GitHub Sync",
      description:
        "Any changes made on CodeCrew are instantly reflected on GitHub, ensuring a smooth development workflow.",
    },
    {
      title: "Developer-Centric Platform",
      description:
        "Designed specifically for coders, CodeCrew provides an intuitive interface to streamline open-source and private project collaborations.",
    },
  ];

  return (
    <div className="w-screen min-h-screen bg-black text-white flex flex-col items-center px-6 ">
      {/* Hero Section */}
      <div className="flex flex-col items-center  py-6 text-center lg:grid lg:grid-cols-2 lg:justify-self-center justify-center">
        <div className="size-56 lg:size-10/12 lg:col-span-1 lg:order-last justify-self-center">
          <img src="/logoimg.png" alt="CodeCrew Logo" />
        </div>
        <div className="lg:col-span-1 ">
        <Typewriter
          text="What is CodeCrew?"
          typingSpeed={40}
          deletingSpeed={30}
          delayBeforeDelete={2000}
          delayBeforeRestart={1000}
        />
        <p className="text-zinc-400 p-4 lg:text-2xl">
          CodeCrew is a platform where developers looking for teammates can list
          their projects. Profiles with the required tech stack can view project
          details and send collaboration requests. CodeCrew syncs with GitHub
          in real time, allowing users to create projects and initialize
          repositories seamlessly.
        </p>
        <div>
          <Signupbutton />
        </div>
        </div>
      </div>
      <div className="hidden lg:flex w-screen justify-center">
  <span className="bg-slate-600 h-0.5 w-11/12 block rounded-full"></span>
</div>
      
      {/* Why Choose Us? */}
      <div className="flex flex-col items-center  py-10 text-center">
        <h2 className="text-3xl lg:text-6xl font-bold">Why Choose Us?</h2>
        <p className="text-zinc-400 p-4 lg:text-3xl">
          At CodeCrew, we bridge the gap between developers and real-time
          collaboration. Unlike traditional project management tools, CodeCrew
          integrates directly with GitHub, ensuring that every repository
          update, commit, and collaboration happens seamlessly and
          automatically.
        </p>
      </div>

      {/* Features Section */}
      <div className="flex flex-col items-center max-w-4xl lg:w-5xl pt-10">
        <h2 className="text-3xl font-bold text-center pb-6">
          What Makes Us Unique?
        </h2>
        <div className="grid md:grid-cols-2 gap-6">
          {features.map((feature, index) => (
            <div
              key={index}
              className="flex items-start space-x-4 bg-slate-800 p-4 rounded-2xl shadow-md"
            >
              <span className="text-green-400 text-xl">✅</span>
              <div>
                <h3 className="text-lg font-semibold">{feature.title}</h3>
                <p className="text-zinc-400">{feature.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
      <footer className="w-full pb-4 pt-4 text-center text-neutral-400 relative z-20 lg:text-xl">
        Made with love by <a className="text-green-500 font-semibold" href="https://www.linkedin.com/in/navkirat-singh-a70220275?utm_source=share&utm_campaign=share_via&utm_content=profile&utm_medium=ios_app" target="_blank">Navkirat Singh</a>
      </footer>
    </div>
  );
}
