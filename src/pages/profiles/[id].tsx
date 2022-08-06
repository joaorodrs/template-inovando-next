import { GetServerSideProps } from "next";
import PrivatePage from "@/layouts/PrivatePage";
import { Container } from "@chakra-ui/react";
import React, { ReactElement, useRef } from "react";
import { NextPageWithLayout } from "../_app";
import api, { getAPIClient, httpErrorHandler } from "@/services/api";
import { ProfileData } from "@/typings/profile";
import ProfilesForm from "@/components/forms/ProfilesForm";
import {
  FormValues,
  ProfilesFormRefType,
} from "@/components/forms/ProfilesForm/ProfilesForm";
import { SubmitHandler } from "react-hook-form";
import { toast } from "react-toastify";
import omit from "lodash.omit";
import { removeEmptyValues } from "@/utils/parse";

type Props = {
  data: ProfileData;
};

const ProfileId: NextPageWithLayout<Props> = ({ data }) => {
  const formRef = useRef<ProfilesFormRefType>(null);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    removeEmptyValues(values);
    const apiValues = omit(values, ["id", "created_at", "confirmPassword"]);
    try {
      await api.put(`/profiles/${values.id}`, apiValues);
    } catch (error) {
      httpErrorHandler(error, formRef.current?.setError);
    }
    toast.success("Data edited successfully!");
    (document.activeElement as HTMLElement).blur();
  };

  return (
    <Container maxW="600px" m="auto" py={10}>
      <ProfilesForm ref={formRef} onSubmit={onSubmit} defaultValues={data} />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const id = ctx.query.id;
  const api = getAPIClient(ctx);
  const { data } = await api.get(`profiles/${id}`);

  return {
    props: {
      data,
    },
  };
};

ProfileId.getLayout = (page: ReactElement) => {
  return <PrivatePage>{page}</PrivatePage>;
};

export default ProfileId;
