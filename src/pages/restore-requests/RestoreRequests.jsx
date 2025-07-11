import Table from "../../components/ui/Table";
import { USER_REQUESTS_TABLE_HEADINGS } from "../../constants/tables/headings";
import { useQuery } from "@tanstack/react-query";
import React, { useState } from "react";
import TableSkeleton from "../../components/ui/TableSkeleton";
import IconLink from "../../components/ui/IconLink";
import { VIEW_DETAIL_ICON } from "../../assets/icons/DynamicIcons";
import { userRestoreRequestsAPIs } from "../../features/user-requests/api";
import { toast } from "sonner";
import Searchbar from "../../components/ui/Searchbar";
import ResponsiveRequestCard from "../../features/user-requests/components/ResponsiveRequestCard";

const RestoreRequests = () => {
  // Filters Data
  const [filtersData, setFiltersData] = useState({
    search: "",
    page: 1,
  });

  // Fetch User Requests Query
  const { data, isError, error, isPending } = useQuery({
    queryKey: ["userRequestsQuery", filtersData],
    queryFn: () =>
      userRestoreRequestsAPIs.fetchUsersWithRequests({
        filtersData,
      }),
  });

  if (isError) {
    return toast.error("Error!", {
      message: error.message,
      duration: 3000,
      richColors: true,
    });
  }

  const rows = data?.users?.map((user, index) => (
    <React.Fragment key={user._id}>
      <Table.ItemRoot className="md:grid hidden">
        <Table.SingleColumn>
          <p className="text-[14px] font-medium text-[#6C727F]">{index + 1}</p>
        </Table.SingleColumn>
        <Table.DoubleColumn>
          <p className="text-[14px] font-medium text-[#6C727F]">
            {user.fullname}
          </p>
        </Table.DoubleColumn>
        <Table.DoubleColumn>
          <p className="text-[14px] font-medium text-[#6C727F] break-all w-full">
            {user.email}
          </p>
        </Table.DoubleColumn>
        <Table.DoubleColumn className="justify-end">
          <IconLink
            id="view-restore-request-details"
            href={`details/${user._id}?type=TEMPLATE`}
            icon={<VIEW_DETAIL_ICON className="h-[16px]" />}
            label="View Details"
          />
        </Table.DoubleColumn>
      </Table.ItemRoot>
      <ResponsiveRequestCard requestData={user} />
    </React.Fragment>
  ));

  return (
    <Table.Root className="lg:p-[16px] mt-0 md:!border border-0 h-full md:p-[12px]">
      {/* Table Header */}
      <Table.Header className="lg:!grid !hidden">
        {USER_REQUESTS_TABLE_HEADINGS.map((heading) =>
          heading.key !== "serialNo" ? (
            <Table.DoubleColumn key={heading.key}>
              <Table.HeaderItem heading={heading.value} />
            </Table.DoubleColumn>
          ) : (
            <Table.SingleColumn key={heading.key}>
              <Table.HeaderItem heading={heading.value} />
            </Table.SingleColumn>
          )
        )}
        <Table.DoubleColumn className="justify-end">
          <Searchbar
            id="search-user-request"
            placeholder="Search requests by user..."
            onSearch={(value) =>
              setFiltersData((prev) => ({ ...prev, search: value }))
            }
            className="!bg-white !border border-primary"
          />
        </Table.DoubleColumn>
      </Table.Header>

      <div className="lg:hidden flex w-full justify-end">
        <Searchbar
          id="search-user-request"
          placeholder="Search requests by user..."
          onSearch={(value) =>
            setFiltersData((prev) => ({ ...prev, search: value }))
          }
          className="md:!bg-white !border md:border-primary border-[#DAEAFF] md:w-[305px] w-full"
        />
      </div>

      {/* Table Body */}
      <Table.Body
        className={`${
          data?.totalPages < 2
            ? "h-[calc(100%-72px)] lg:h-[calc(100%-96px)] xl:h-[calc(100%-120px)]"
            : "h-[calc(100%-82px)] lg:h-[calc(100%-106px)] xl:h-[calc(100%-130px)]"
        } md:!px-[12px] md:pt-[24px] pt-[16px]`}
      >
        {isPending ? (
          <TableSkeleton itemsLength={4} />
        ) : data?.users?.length < 1 ? (
          <div className="flex justify-center items-center h-full">
            <p className="text-[14px] font-medium text-[#6C727F] text-center">
              No User Request Found for restoring templates.
            </p>
          </div>
        ) : (
          rows
        )}
      </Table.Body>

      {data && data?.totalPages > 0 && (
        <Table.Pagination
          filtersData={filtersData}
          setFiltersData={(value) => setFiltersData({ page: value.page })}
          paginationData={{
            totalPages: data?.totalPages,
            currentPage: data?.currentPage,
            totalItems: data?.totalUsers,
          }}
        />
      )}
    </Table.Root>
  );
};

export default RestoreRequests;
