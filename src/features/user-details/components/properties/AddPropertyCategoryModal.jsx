import { useForm } from "@mantine/form";
import Button from "../../../../components/ui/Button";
import { ModalActions, ModalRoot } from "../../../../components/ui/Modal";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Divider, Stepper, TextInput } from "@mantine/core";
import { toast } from "sonner";
import { useParams } from "react-router";
import { userPropertiesAPIs } from "../../api/user-properties";
import { useState } from "react";
import ElementQuestionModal from "../common/AddElementQuestionComponents";
import { ARROW_RIGHT_ICON } from "../../../../assets/icons/ArrowRightIcon";
import { EDIT_DETAILS_ICON } from "./../../../../assets/icons/EditIcon";
import { PROPERTY_CATEGORY_ICONS } from "../../../../constants/propertyCategoryIcons";

const IconsList = ({ selectedIcon, onIconSelect }) => (
  <div className="flex flex-col gap-[12px]">
    <p className="text-[16px] font-medium text-dark-blue">Select Icons</p>
    <div className="flex items-center gap-[8px] flex-wrap mt-[12px]">
      {PROPERTY_CATEGORY_ICONS.map(({ id, Icon }) => {
        const isSelected = selectedIcon === id;

        return (
          <button
            key={id}
            className={`hover:bg-[#DFECFF] p-[4px] h-[35px] w-[35px] flex items-center justify-center ${
              isSelected ? "bg-[#DFECFF]" : "bg-white"
            }`}
            onClick={() => onIconSelect(id)} // use id instead of icon component
          >
            <Icon className="text-dark-blue w-[20px] h-[20px]" />
          </button>
        );
      })}
    </div>
  </div>
);

const AddPropertyCategoryModal = ({ isModalOpen, onCloseModal }) => {
  // Hooks
  const queryClient = useQueryClient();
  const { userId } = useParams();

  // Local States
  const [active, setActive] = useState(0);
  // state to save the selectedIcon for the option
  //   const [iconOptionIndex, setIconOptionIndex] = useState();
  const [selectedIcon, setSelectedIcon] = useState("");

  const form = useForm({
    initialValues: {
      propertyCategory: "",
      propertyCategoryIconId: "",
    },
    validate: {
      propertyCategory: (value) =>
        value.length < 1 ? "Property Category is required" : null,
      propertyCategoryIconId: (value) =>
        !value ? "Property Category Icon is required" : null,
    },
  });

  // Create Property Category - Mutation
  const createPropertyCategory = useMutation({
    mutationFn: () =>
      userPropertiesAPIs.createPropertyCategory({
        value: form.values.propertyCategory,
        iconId: form.values.propertyCategoryIconId,
        userId: userId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["userAddedPropertyCategories"],
      });
      toast.success("Success!", {
        description: `Property Category created successfully.`,
        duration: 3000,
        richColors: true,
      });
      onCloseModal();
      form.reset();
    },
    onError: () => {
      toast.error("Error!", {
        description: `Couldn't create Property Category.`,
        duration: 3000,
        richColors: true,
      });
    },
  });

  // Handle Save Option Icon
  const handleSaveOptionIcon = () => {
    // const selectedIconId = PROPERTY_CATEGORY_ICONS_WITH_FUNCTIONS.find(
    //   (icon) => icon.icon === selectedIcon
    // ).id;

    // Update the newQuestionData with the new options
    form.setFieldValue("propertyCategoryIconId", selectedIcon);

    setActive(0);
    setSelectedIcon("");
  };

  return (
    <ModalRoot
      id="add-property-category-modal"
      loadingOverlay={createPropertyCategory.isPending}
      openModal={isModalOpen}
      onClose={() => onCloseModal()}
    >
      <Stepper
        styles={{
          steps: {
            display: "none",
          },
          content: {
            padding: 0,
          },
        }}
        active={active}
        onStepClick={setActive}
      >
        <Stepper.Step id="category-name-input">
          <h2 className="font-bold md:text-[18px] text-[16px] text-dark-blue mb-[16px]">
            Add Property Category
          </h2>
          <div className="flex flex-col gap-[5px] w-full">
            <div className="flex items-center gap-[12px] border border-[#CCE2FF] rounded-[12px_8px] p-[8px]">
              <TextInput
                placeholder="Add New Category"
                value={form.values.propertyCategory}
                onChange={(e) =>
                  form.setFieldValue("propertyCategory", e.target.value)
                }
                className="flex-1 h-fit"
                classNames={{
                  input:
                    "!border-none focus:!border-none focus:!outline-none !bg-transparent !p-0 !h-fit",
                }}
              />
              {form.values.propertyCategoryIconId ? (
                <div className="flex items-center gap-[8px]">
                  <p className={`text-[#6C727F] text-[14px] font-semibold`}>
                    Icon:
                  </p>

                  {(() => {
                    const iconEntry = PROPERTY_CATEGORY_ICONS.find(
                      (icon) => icon.id === form.values.propertyCategoryIconId
                    );
                    const Icon = iconEntry?.Icon;
                    return Icon ? (
                      <Icon className="text-dark-blue w-[20px] h-[20px]" />
                    ) : null;
                  })()}
                  <Divider orientation="vertical" color="#CCE2FF" />
                  <Button
                    id="edit-property-category-icon"
                    type="iconButton"
                    icon={
                      <EDIT_DETAILS_ICON className="w-[18px] text-dark-gray hover:cursor-pointer hover:text-dark-blue" />
                    }
                    onClick={() => setActive(1)}
                    className="!bg-transparent !p-0 !h-fit"
                  />
                </div>
              ) : (
                <button
                  type="button"
                  className="text-[14px] text-[#6C727F] font-semibold"
                  onClick={() => setActive(1)}
                >
                  Add Icon
                </button>
              )}
            </div>
            {/* Show error message */}
            {form.errors.propertyCategory ||
            form.errors.propertyCategoryIconId ? (
              <p className="text-[12px] text-[#fa5252]">
                Category Name and Icon is required!
              </p>
            ) : null}
          </div>
          <ModalActions>
            <Button
              id="confirm-add-property-category"
              type="button"
              buttonType="contained"
              onClick={() => {
                // Validate Form such that it contains category name and iconId
                form.validate();

                if (form.isValid()) {
                  return createPropertyCategory.mutate();
                } else {
                  return;
                }
              }}
              label="Add Category"
              buttonColor="#FF613E"
              className="!font-bold hover:!bg-warning-red-dark"
            />
            <Button
              id="cancel-add-property-category"
              type="button"
              buttonType="outlined"
              onClick={() => onCloseModal()}
              label="Cancel"
              className="!font-bold"
            />
          </ModalActions>
        </Stepper.Step>
        <Stepper.Step id="category-icon">
          <ElementQuestionModal.Root>
            <Button
              id="goBack-to-existing-questions"
              onClick={() => {
                setActive(0);
              }}
              type="button"
              buttonType="iconButton"
              icon={
                <ARROW_RIGHT_ICON className="transform rotate-180 w-[20px] h-[20px]" />
              }
              label="Go Back"
              className="!w-fit !font-semibold !h-fit !text-[18px]"
            />
            <Divider className="w-full !border-t-[1.5px]" color="#E4F0FF" />

            <IconsList
              selectedIcon={selectedIcon}
              onIconSelect={(icon) => setSelectedIcon(icon)}
            />
            <ElementQuestionModal.Actions>
              <Button
                id="add-icon-to-question"
                type="button"
                onClick={handleSaveOptionIcon}
                buttonType="contained"
                label="Save"
                className="sm:w-[208px] w-full"
              />
              <Button
                id="cancel-add-icon-to-question"
                label="Cancel"
                className="!text-primary sm:w-[208px] w-full hover:!bg-[#FF613E] hover:!border-[#FF613E]"
                type="button"
                buttonType="outlined"
                borderColor="#CCE2FF"
                onClick={() => setActive(0)}
              />
            </ElementQuestionModal.Actions>
          </ElementQuestionModal.Root>
        </Stepper.Step>
      </Stepper>
    </ModalRoot>
  );
};

export default AddPropertyCategoryModal;
