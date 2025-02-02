import logo from "../assets/large-logo.svg";
import Navbar from "./../components/Navbar";
import Sidebar from "./../components/Sidebar";

const SidebarLayout = ({ children }) => {
  return (
    <main className="App overflow-x-hidden">
      <section className="fixed top-0 z-[10] flex">
        <div className="md:h-[96px] h-[72px] p-[24px] border-r-[1.5px] border-[#ECECEC] min-[1630px]:w-[305px] lg:w-[230px] bg-white lg:flex hidden items-center">
          <img src={logo} alt="inspectBuddy-logo" />
        </div>
        <Navbar withSidebar={true} />
      </section>
      <section className="md:flex md:mt-[96px] mt-[72px] relative">
        <Sidebar />
        <div className="md:p-[24px] p-[20px]">{children}</div>
      </section>
    </main>
  );
};

export default SidebarLayout;
