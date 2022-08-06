import InputText from "@/components/inputs/InputText";
import { Button } from "@chakra-ui/react";
import { yupResolver } from "@hookform/resolvers/yup";
import {
  forwardRef,
  ForwardRefRenderFunction,
  useImperativeHandle,
} from "react";
import { SubmitHandler, useForm, UseFormSetError } from "react-hook-form";
import schema from "./schema";

export type FormValues = {
  id: string;
  name: string;
  created_at?: string;
  updated_at?: string;
};

type Props = {
  onSubmit: SubmitHandler<FormValues>;
  defaultValues?: Partial<FormValues>;
};

export type ProfilesFormRefType = {
  setError: UseFormSetError<FormValues>;
};

const ProfilesForm: ForwardRefRenderFunction<ProfilesFormRefType, Props> = (
  { onSubmit, defaultValues },
  ref
) => {
  const {
    handleSubmit,
    control,
    formState: { isSubmitting },
    setError,
  } = useForm<FormValues>({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      ...defaultValues,
    },
  });

  useImperativeHandle(ref, () => ({
    setError,
  }));

  return (
    <form onSubmit={handleSubmit(onSubmit)} noValidate>
      <InputText label="Nome" name="name" control={control} />
      <Button
        mt={8}
        colorScheme="brand"
        isLoading={isSubmitting}
        type="submit"
        isFullWidth={true}
      >
        Submit
      </Button>
    </form>
  );
};

export default forwardRef(ProfilesForm);
