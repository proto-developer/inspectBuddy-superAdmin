import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { useState } from "react";
import { useNavigate, useParams } from "react-router";
import { userDetailsAPIs } from "../../../features/user-details/api";
import { toast } from "sonner";
import FiltersTopbar from "../../../components/ui/FiltersTopbar";
import { TEMPLATE_CATEGORIES } from "../../../constants/filters";
import FilterSelect from "../../../components/ui/FilterSelect";
import { Group, TextInput } from "@mantine/core";
import Searchbar from "../../../components/ui/Searchbar";
import DateRangeFilter from "../../../components/ui/DateRangeFilter";
import Table from "../../../components/ui/Table";
import { TEMPLATES_TABLE_HEADINGS } from "../../../constants/tables/headings";
import AddNewTemplateBtn from "../../../features/user-details/components/templates/AddNewTemplateBtn";
import TableSkeleton from "../../../components/ui/TableSkeleton";
import { convertDateFormate } from "../../../features/user-details/services/convertDateFormate";
import TemplateCategoryCard from "../../../features/user-details/components/templates/TemplateCategoryCard";
import IconLink from "../../../components/ui/IconLink";
import {
  CLONE_ICON,
  DELETE_ICON,
  VIEW_DETAIL_ICON,
} from "../../../assets/icons/DynamicIcons";
import Button from "../../../components/ui/Button";
import ResponsiveTemplateCard from "../../../features/user-details/components/templates/ResponsiveTemplateCard";
import AddNewTemplateModal from "../../../features/user-details/components/templates/AddNewTemplateModal";
import { ModalActions } from "../../../components/ui/Modal";
import { userTemplatesAPIs } from "../../../features/user-details/api/template";
import DeleteTemplateModal from "../../../features/user-details/components/templates/DeleteTemplateModal";

const UserTemplates = () => {
  // Hooks
  const { userId } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  //  Local States
  const [filtersData, setFiltersData] = useState({
    status: "all",
    page: 1,
    search: "",
    startdate: "",
    enddate: "",
  });

  const [newTemplateModalData, setNewTemplateModalData] = useState({
    openModal: false,
    templateName: "",
  });
  const [templateToDeleteData, setTemplateToDeleteData] = useState({
    openModal: false,
    templateId: "",
    templateName: "",
  });

  // Query to fetch the Templates
  const { data, isError, error, isPending } = useQuery({
    queryKey: ["templatesQuery", filtersData, userId],
    queryFn: () =>
      userDetailsAPIs.fetchUserAddedTemplates({ userId: userId, filtersData }),
  });

  // Create New Template - Mutation
  const createNewTemplate = useMutation({
    mutationFn: () =>
      userTemplatesAPIs.createNewTemplate({
        templateName: newTemplateModalData.templateName,
        userId: userId,
      }),
    onSuccess: (data) => {
      setNewTemplateModalData({ openModal: false, templateName: "" });
      navigate(
        `/user-details/${userId}/templates/details/${data.templateId}/edit-details`
      );
      toast.success("Template Created Successfully!", {
        duration: 3000,
        richColors: true,
      });
    },

    onError: (error) => {
      toast.error("Error!", {
        description:
          error.response?.data?.message || "Couldn't create Template!",
        duration: 3000,
        richColors: true,
      });
    },
  });

  // Delete Template - Mutation
  const deleteTemplate = useMutation({
    mutationFn: () =>
      userTemplatesAPIs.deleteTemplate({
        templateId: templateToDeleteData.templateId,
        userId: userId,
      }),
    onSuccess: () => {
      setTemplateToDeleteData({ openModal: false, templateId: "" });
      queryClient.invalidateQueries({
        queryKey: ["templatesQuery"],
      });
      toast.success("Template Deleted Successfully!", {
        duration: 3000,
        richColors: true,
      });
    },
    onError: () => {
      toast.error("Error!", {
        description: "Couldn't delete Template!",
        duration: 3000,
        richColors: true,
      });
    },
  });

  // Clone Template - Mutation
  const cloneTemplate = useMutation({
    mutationFn: (templateId) =>
      userTemplatesAPIs.cloneTemplate({
        templateId: templateId,
        userId: userId,
      }),
    onSuccess: () => {
      setTemplateToDeleteData({ openModal: false, templateId: "" });
      queryClient.invalidateQueries({
        queryKey: ["templatesQuery", filtersData, userId],
      });
      toast.success("Template Cloned Successfully!", {
        duration: 3000,
        richColors: true,
      });
    },
    onError: () => {
      toast.error("Error!", {
        description: "Couldn't clone Template!",
        duration: 3000,
        richColors: true,
      });
    },
  });

  if (isError) {
    return toast.error("Error!", {
      description: error.message || "Couldn't fetch user's Templates!",
      duration: 3000,
    });
  }

  const rows = data?.templates.map((template) => {
    return window.innerWidth > 1150 ? (
      <Table.ItemRoot key={template._id}>
        <Table.SingleColumn>
          <p className="text-[14px] font-medium text-tertiary">
            {convertDateFormate.internationalDate(template.updatedAt)}
          </p>
        </Table.SingleColumn>
        <Table.DoubleColumn>
          <p className="text-[14px] font-medium text-tertiary">
            {template.name}
          </p>
        </Table.DoubleColumn>
        <Table.SingleColumn>
          <TemplateCategoryCard
            templateType={
              template.isDefault
                ? "default"
                : template.isDraft
                ? "draft"
                : "published"
            }
          />
        </Table.SingleColumn>
        <Table.TripleColumn>
          <Table.ItemActions>
            <IconLink
              href={`details/${template._id}`}
              icon={<VIEW_DETAIL_ICON className="h-[16px]" />}
              label="View Details"
            />
            <Button
              id="clone-template-btn"
              label="Clone Template"
              buttonType="iconButton"
              icon={<CLONE_ICON className="text-[#9EA3AE] h-[16px] w-[16px]" />}
              type="button"
              onClick={() => cloneTemplate.mutate(template._id)}
              className="flex items-center !gap-[8px] !p-[8px_10px] border-[1.5px] rounded-[8px] !border-[#E5E6EB] w-fit !text-dark-blue !text-[12px] h-fit !font-medium"
            />
            <Button
              id="delete-template-btn"
              buttonType="iconButton"
              icon={<DELETE_ICON className="text-[#9EA3AE]" />}
              type="button"
              onClick={() =>
                setTemplateToDeleteData({
                  openModal: true,
                  templateId: template._id,
                  templateName: template.name,
                })
              }
            />
          </Table.ItemActions>
        </Table.TripleColumn>
      </Table.ItemRoot>
    ) : (
      <ResponsiveTemplateCard
        key={template._id}
        templateData={template}
        onCloneTemplate={() => {}}
      />
    );
  });

  return (
    <React.Fragment>
      {/* Add New Template Modal */}
      <AddNewTemplateModal
        isModalOpen={newTemplateModalData.openModal}
        onCloseModal={() => {
          setNewTemplateModalData((prev) => ({ ...prev, openModal: false }));
        }}
        isCreatingTemplate={createNewTemplate.isPending}
      >
        <TextInput
          id="template-name"
          label="Template Name"
          placeholder="Enter Template Name"
          value={newTemplateModalData.templateName}
          onChange={(e) => {
            setNewTemplateModalData((prev) => ({
              ...prev,
              templateName: e.target.value,
            }));
          }}
        />
        <ModalActions>
          <Button
            id="confirm-create-template"
            type="button"
            buttonType="contained"
            onClick={() => createNewTemplate.mutate("")}
            label="Continue"
            buttonColor="#FF613E"
            className="!font-bold hover:!bg-warning-red-dark"
          />
          <Button
            id="cancel-create-template"
            type="button"
            buttonType="outlined"
            onClick={() => {
              setNewTemplateModalData((prev) => ({
                ...prev,
                openModal: false,
              }));
            }}
            label="Cancel"
            className="!font-bold"
          />
        </ModalActions>
      </AddNewTemplateModal>

      {/* Delete Template Modal */}
      <DeleteTemplateModal
        isModalOpen={templateToDeleteData.openModal}
        onCloseModal={() => {
          setTemplateToDeleteData((prev) => ({ ...prev, openModal: false }));
        }}
        isDeletingTemplate={deleteTemplate.isPending}
        onDeleteTemplate={() => deleteTemplate.mutate()}
      ></DeleteTemplateModal>

      {/* Filters Topbar */}
      <FiltersTopbar>
        <FilterSelect
          options={TEMPLATE_CATEGORIES}
          onChange={(value) => {
            setFiltersData((prev) => ({ ...prev, status: value }));
          }}
          initialValue={null}
          placeholder="Select Category"
        />
        <Group gap="sm">
          <Searchbar
            placeholder="Search properties by name..."
            onSearch={(value) =>
              setFiltersData((prev) => ({ ...prev, search: value }))
            }
          />
          <DateRangeFilter
            filtersData={filtersData}
            setFiltersData={setFiltersData}
            tooltipLabel="Select Date Range - Filter by 'Updated on'"
          />
        </Group>
      </FiltersTopbar>
      {/* Templates Table */}
      <Table.Root
        className={`p-[12px] md:h-[calc(100%-84px)] h-[calc(100%-136px)]`}
      >
        {/* Table Header */}
        <Table.Header>
          {TEMPLATES_TABLE_HEADINGS.map((heading) =>
            heading.key === "templateName" ? (
              <Table.DoubleColumn key={heading.key}>
                <Table.HeaderItem heading={heading.value} />
              </Table.DoubleColumn>
            ) : (
              <Table.SingleColumn key={heading.key}>
                <Table.HeaderItem heading={heading.value} />
              </Table.SingleColumn>
            )
          )}
          <AddNewTemplateBtn
            className="col-span-3"
            onClick={() =>
              setNewTemplateModalData((prev) => ({
                ...prev,
                openModal: true,
              }))
            }
          />
        </Table.Header>

        <AddNewTemplateBtn className="w1150:hidden lg:pb-[24px] pb-[12px] lg:mb-0 mb-[12px] border-b border-[#E4F0FF]" />

        {/* Table Body */}
        <Table.Body
          className={`${
            data?.totalPages < 2
              ? "w1150:!h-[calc(100%-129.28px)] lg:h-[calc(100%-105.28px)] h-[calc(100%-102.38px)]"
              : "w1150:!h-[calc(100%-139.59px)] lg:h-[calc(100%-115.59px)] h-[calc(100%-112.69px)]"
          }`}
        >
          {isPending || cloneTemplate.isPending ? (
            <TableSkeleton itemsLength={4} />
          ) : data?.templates?.length < 1 ? (
            <div className="flex justify-center items-center h-full">
              <p className="text-[14px] font-medium text-[#6C727F] text-center">
                No Templates Found! <br /> Add a new Template to get started.
              </p>
            </div>
          ) : (
            rows
          )}
        </Table.Body>

        {/* Pagination */}
        {data && data?.totalPages && (
          <Table.Pagination
            filtersData={filtersData}
            setFiltersData={(value) =>
              setFiltersData({ ...filtersData, page: value.page })
            }
            paginationData={{
              totalPages: data?.totalPages,
              currentPage: data?.currentPage,
              totalItems: data?.totalTemplates,
            }}
          />
        )}
      </Table.Root>
    </React.Fragment>
  );
};

export default UserTemplates;
