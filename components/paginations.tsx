
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { usePagination } from "@/hooks/use-pagination";

import { useSearchParams } from "next/navigation";

interface IProps {
  pagination: Pagination;
  siblingCount?: number;
}

const PaginationAction = (props: IProps) => {
  const { pagination, siblingCount = 1 } = props;

  const paginationRange: (number | string)[] | undefined = usePagination({
    siblingCount,
    currentPage: pagination.page,
    totalCount: pagination.totalItems,
    pageSize: pagination.limit,
  });

  const searchParams = useSearchParams();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", page.toString());
    return `/search?${params.toString()}`;
  };

  const currentPage = parseInt(searchParams.get("page") || "1");

  return (
    <Pagination>
      <PaginationContent>
      {currentPage > 1 && (
        <PaginationItem>
          <PaginationPrevious href={createPageUrl(currentPage - 1)} />
        </PaginationItem>
      )}
      {paginationRange?.map((pageNumber: number | string, index: number) => {
        if (pageNumber === "...") {
          return <PaginationItem key={index}>
                  <PaginationEllipsis />
                </PaginationItem>
        }
        return (
          <PaginationItem key={index}>
            <PaginationLink isActive={pageNumber === pagination.page} href={createPageUrl(+pageNumber)}>
            {pageNumber}
            </PaginationLink>
          </PaginationItem>
        );
      })}
      {pagination.page !== pagination.totalPages && <PaginationItem>
          <PaginationNext href={createPageUrl(currentPage + 1)} />
        </PaginationItem>}
        
      </PaginationContent>
    </Pagination>
  );
};

export default PaginationAction;
