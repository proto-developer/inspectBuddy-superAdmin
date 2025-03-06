import { useNavigate, useParams } from "react-router";
import DetailPagesRoot from "../../../../features/user-details/components/DetailPagesRoot";
import { useQuery } from "@tanstack/react-query";
import { userDetailsAPIs } from "../../../../features/user-details/api";
import { toast } from "sonner";
import {
  PropertyDetailsBody,
  PropertyDetailsContainer,
  PropertyDetailsHeader,
  PropertyDetails,
  PropertyDetailsGrid,
  PropertyDetailsItem,
  PropertyInspectionStats,
} from "../../../../features/user-details/components/properties/details/PropertyDetails";
import { convertDateFormate } from "../../../../features/user-details/services/convertDateFormate";

const ViewUserProperty = () => {
  // Hooks
  const { propertyId } = useParams();
  const navigate = useNavigate();

  // Query to fetch user Details
  const { data, isError, error, isPending } = useQuery({
    queryKey: ["subUserDetailsQuery", propertyId],
    queryFn: () =>
      userDetailsAPIs.fetchPropertyDetails({ propertyId: propertyId }),
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 5 * 60 * 1000, // 5 minutes
  });

  if (isPending) {
    return <div>Loading...</div>;
  }

  if (isError) {
    navigate(-1);
    return toast.error("Error!", {
      description: error.message || `Couldn't fetch Property Details.`,
      duration: 3000,
    });
  }

  const propertyDetails = data?.property;

  return (
    <DetailPagesRoot className="max-w-[892px]">
      <PropertyDetailsContainer>
        <PropertyDetailsHeader propertyImageURL={propertyDetails?.image?.url} />
        <PropertyDetailsBody>
          <PropertyDetails propertyDetails={propertyDetails} />
          <PropertyDetailsGrid>
            <PropertyDetailsItem
              label="Category"
              value={propertyDetails?.category?.value}
            />
            <PropertyDetailsItem
              label="Country"
              value={propertyDetails?.address?.country}
            />
            <PropertyDetailsItem
              label="State/Province"
              value={propertyDetails?.address?.state}
            />
            <PropertyDetailsItem
              label="City/Town"
              value={propertyDetails?.address?.city}
            />
            <PropertyDetailsItem
              label="Added On"
              value={convertDateFormate.localeDate(propertyDetails?.createdAt)}
            />

            <PropertyDetailsItem
              label="Zip/Postal Code"
              value={propertyDetails?.address?.zip}
            />

            <PropertyDetailsItem
              label="Reference ID"
              className={"col-span-2"}
              value={
                propertyDetails.isIDGenerated
                  ? "No Reference ID Added"
                  : propertyDetails?.referenceId
              }
            />
          </PropertyDetailsGrid>
          <PropertyInspectionStats
            totalInspections={data?.totalInspections}
            daysSinceLastInspection={data?.daysSinceLastInspection}
            daysSinceLastCompletedInspection={
              data?.daysSinceLastCompletedInspection
            }
          />
        </PropertyDetailsBody>
      </PropertyDetailsContainer>
    </DetailPagesRoot>
  );
};

export default ViewUserProperty;
