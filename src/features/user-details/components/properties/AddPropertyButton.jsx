import { Link } from "react-router";
import { cn } from "../../../../utils/cn";

const AddPropertyButton = ({ className }) => {
  return (
    <div className={cn("flex items-center justify-end", className)}>
      <Link
        id="add-property"
        to="add-new-property"
        className="text-white p-[12px_16px] bg-primary font-semibold text-[14px] rounded-[8px]"
      >
        Add New Property
      </Link>
    </div>
  );
};

export default AddPropertyButton;
