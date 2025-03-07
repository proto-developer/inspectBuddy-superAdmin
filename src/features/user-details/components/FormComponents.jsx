import { useUserDetailsStore } from "./../../../store/userDetailsStore";
import EditUserInfoIcon from "../../../assets/icons/edit-icon.svg";

const UserDetailsFormRoot = ({ children, onFormSubmit }) => (
  <section className="flex-1 border-[1.5px] border-[#CCE2FF] rounded-[8px] bg-white lg:px-[30px] md:px-[24px] px-[16px] lg:py-[40px] py-[24px] md:py-[32] h-fit">
    <form onSubmit={onFormSubmit} className="flex flex-col gap-[32px]">
      {children}
    </form>
  </section>
);

const UserDetailFormSection = ({ children, heading }) => {
  // Global States
  const editingUserDetails = useUserDetailsStore(
    (state) => state.editingUserDetails
  );
  const setEditingUserDetails = useUserDetailsStore(
    (state) => state.setEditingUserDetails
  );

  return (
    <div className="flex flex-col gap-[32px]">
      <div className="flex justify-between items-center">
        <h1 className="text-dark-blue font-bold text-[20px]">{heading}</h1>
        {heading === "User Details" && !editingUserDetails && (
          <button
            type="button"
            className="md:hidden block"
            onClick={() => setEditingUserDetails(true)}
          >
            <img
              src={EditUserInfoIcon}
              alt="Edit Icons"
              className="w-[24px] h-[24px]"
            />
          </button>
        )}
      </div>
      <div className="md:px-[30px] flex flex-col gap-[32px]">{children}</div>
    </div>
  );
};

const UserDetailsFormRow = ({ children }) => (
  <div className="md:grid grid-cols-2 gap-x-[24px] md:gap-y-[32px] flex flex-col sm:gap-[24px] gap-[16px]">
    {children}
  </div>
);

const UserDetailsFormAction = ({ children, showButtons }) => (
  <div
    className={`flex gap-[16px] items-center justify-center ${
      showButtons ? "block" : "hidden"
    }`}
  >
    {children}
  </div>
);

const EditUserDetailsForm = {
  UserDetailsFormRoot,
  UserDetailFormSection,
  UserDetailsFormRow,
  UserDetailsFormAction,
};

export default EditUserDetailsForm;
