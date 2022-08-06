import DataTable from "@/components/DataTable";
import { useMutation, useQuery, useQueryClient } from "react-query";
import api from "@/services/api";
import { useCallback, useMemo, useState } from "react";
import { HStack, IconButton } from "@chakra-ui/react";
import { MdArrowRightAlt, MdDelete } from "react-icons/md";
import { ProfileResponse } from "@/typings/profile";
import { toast } from "react-toastify";
import Link from "next/link";
import NameForm from "@/components/forms/NameForm";
import { format, parseISO } from "date-fns";
import ConfirmDialog from "@/components/ConfirmDialog";
import InlineEdit from "@/components/InlineEdit";

export type FormValues = {
  name: string;
};

function ProfilesTable() {
  const perPage = 5;
  const [page, setPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState("");
  const [currentCell, setCurrentCell] = useState(null);
  const [currentText, setCurrentText] = useState("");
  const [idToDelete, setIdToDelete] = useState<number | null>(null);
  const queryClient = useQueryClient();
  const { mutateAsync, isLoading: isLoadingDeletion } = useMutation(() =>
    api.delete(`/profiles/${idToDelete}`)
  );

  const {
    data: profiles,
    isLoading,
    error,
  } = useQuery(["profile", page, searchTerm], () =>
    api
      .get("profiles", {
        params: {
          q: searchTerm,
          page,
          perPage,
          order: "created_at",
          status: true,
        },
      })
      .then((response) => response.data)
  );

  const onEscapeKeypress = useCallback(() => {
    setCurrentCell(null);
    setCurrentText("");
  }, []);

  const columns = useMemo(
    () => [
      {
        Header: "Name",
        accessor: "name",
        Cell: (data: any) => (
          <InlineEdit
            isEditing={currentCell === data.cell.row.original.id}
            onClickEdit={() => {
              setCurrentCell(data.cell.row.original.id);
              setCurrentText(data.value);
            }}
            value={data.value}
            FormComponent={
              <NameForm
                onSubmit={(values) => {
                  api
                    .put(`profiles/${currentCell}`, {
                      name: values.name,
                    })
                    .catch(() => {
                      toast.error("Couldn't edit profile, try again later");
                    });
                  queryClient.setQueryData(
                    ["profile", page, searchTerm],
                    (old: Partial<ProfileResponse> | undefined) => {
                      return {
                        ...old,
                        data: old?.data?.map((data) =>
                          data.id === currentCell
                            ? { ...data, name: values.name }
                            : data
                        ),
                      };
                    }
                  );
                  setCurrentCell(null);
                  setCurrentText("");
                }}
                defaultValues={{ name: currentText }}
                onEscapeKeypress={onEscapeKeypress}
              />
            }
          />
        ),
      },
      {
        Header: "Created at",
        accessor: (row: { createdAt: string }) =>
          format(parseISO(row.createdAt), "Pp"),
        id: "createdAt",
      },
      {
        Header: "Actions",
        Cell: (data: any) => (
          <HStack>
            <Link href={`/profiles/${data.cell.row.original.id}`} passHref>
              <IconButton
                aria-label={"Edit profile"}
                icon={<MdArrowRightAlt size={22} />}
              />
            </Link>
            <IconButton
              aria-label={"Edit profile"}
              onClick={() => {
                setIdToDelete(data.cell.row.original.id);
              }}
              icon={<MdDelete size={22} />}
            />
          </HStack>
        ),
      },
    ],
    [currentCell, currentText, onEscapeKeypress, page, queryClient, searchTerm]
  );

  const onSearchDebounced = useCallback((searchTerm: string) => {
    setSearchTerm(searchTerm);
  }, []);

  const onConfirmDeletion = async () => {
    await mutateAsync();
    queryClient.invalidateQueries(["profile", page, searchTerm]);
    setIdToDelete(null);
    toast.success("Profile deleted successfully!");
  };

  if (error) {
    return (
      <div>
        An error has ocurred: "{(error as { message: string }).message}"
      </div>
    );
  }

  return (
    <>
      <ConfirmDialog
        isOpen={!!idToDelete}
        onConfirm={onConfirmDeletion}
        onClose={() => setIdToDelete(null)}
        isLoading={isLoadingDeletion}
      />
      <DataTable
        columns={columns}
        data={profiles?.data}
        pagination={profiles?.pagination}
        page={page}
        onChangePage={setPage}
        perPage={perPage}
        isLoading={isLoading}
        onSearchDebounced={onSearchDebounced}
        inputPlaceholder="Search by name"
      />
    </>
  );
}

export default ProfilesTable;
