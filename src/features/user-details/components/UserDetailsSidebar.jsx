import { Link, useLocation } from "react-router";
import { useUserDetailsStore } from "../../../store/userDetailsStore";
import { useEffect } from "react";
import { USER_DETAILS_SIDEBAR } from "../../../constants/sidebarItems";
import { Tooltip } from "@mantine/core";

const UserDetailsSidebar = () => {
  // Hooks
  const location = useLocation();

  // Global States
  const activeTab = useUserDetailsStore((state) => state.activeTab);
  const setActiveTab = useUserDetailsStore((state) => state.setActiveTab);
  const showSubUserOption = useUserDetailsStore(
    (state) => state.showSubUserOption
  );

  // Use Effect to set the Active Tab
  useEffect(() => {
    const pathname = location.pathname.split("/").pop();

    if (pathname === "sub-users") {
      setActiveTab("Sub Users");
    } else if (pathname === "properties") {
      setActiveTab("Properties");
    } else if (pathname === "inspections") {
      setActiveTab("Inspections");
    } else if (pathname === "templates") {
      setActiveTab("Templates");
    } else {
      setActiveTab("User Details");
    }
  }, [location, setActiveTab]);

  return (
    <div className="border-[1.5px] border-[#CCE2FF] rounded-[8px] bg-white px-[26.5px] py-[16px] h-fit w-[278px] fixed top-[196px] min-[992px]:flex flex-col gap-[8px] hidden">
      {USER_DETAILS_SIDEBAR.map((page) => {
        const isSubUsersDisabled =
          page.pageTitle === "Sub Users" && !showSubUserOption;

        return (
          <Link
            key={page.pageTitle}
            to={
              isSubUsersDisabled
                ? "#"
                : page.pageTitle === "User Details"
                ? ``
                : `${page.pagePath}`
            }
            className={`w-full rounded-[4px] h-[40px] text-[16px] flex items-center !px-[16px] ${
              activeTab === page.pageTitle
                ? "bg-[rgba(135,184,254,0.12)] text-primary hover:text-darkPrimary hover:bg-[rgba(135,184,254,0.30)]"
                : isSubUsersDisabled
                ? "text-gray-400 cursor-not-allowed"
                : "text-[#5A5A5A] hover:text-gray-dark hover:bg-gray-100"
            }`}
            onClick={() => {
              if (!isSubUsersDisabled) setActiveTab(page.pageTitle);
            }}
            aria-disabled={isSubUsersDisabled}
            // title={isSubUsersDisabled ? "User is not a TOPTIER user." : ""}
          >
            {isSubUsersDisabled ? (
              <Tooltip label="User is not a 'TOPTIER' user.">
                <p>{page.pageTitle}</p>
              </Tooltip>
            ) : (
              page.pageTitle
            )}
          </Link>
        );
      })}
    </div>
  );
};

export default UserDetailsSidebar;
