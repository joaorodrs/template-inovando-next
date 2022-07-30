import React, { useRef } from "react";

import PrivatePage from "@/layouts/PrivatePage";
import { NextPageWithLayout } from "./_app";
import { GetServerSideProps } from "next";
import api, { getAPIClient, httpErrorHandler } from "@/services/api";
import { Container } from "@chakra-ui/react";
import ProfileForm from "@/components/forms/ProfileForm";
import {
  FormValues,
  ProfileFormRefType,
} from "@/components/forms/ProfileForm/ProfileForm";
import { SubmitHandler } from "react-hook-form";
import omit from "lodash.omit";
import { removeEmptyValues } from "@/utils/parse";
import { toast } from "react-toastify";

type Me = {
  created_at: string;
  email: string;
  id: string;
  name: string;
  remember_me_token: string;
  status: true;
  updated_at: string;
};

type PageProps = {
  data: Me;
};

const Me: NextPageWithLayout<PageProps> = ({ data }) => {
  const profileFormRef = useRef<ProfileFormRefType>(null);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    removeEmptyValues(values);
    const apiValues = omit(values, [
      "created_at",
      "id",
      "updated_at",
      "confirmPassword",
    ]);

    try {
      await api.put(`users/${data.id}`, apiValues);
    } catch (error) {
      httpErrorHandler(error, profileFormRef.current?.setError);
    } finally {
      toast.success("Data edited successfully!");
      profileFormRef.current?.setValue("password", "");
      profileFormRef.current?.setValue("confirmPassword", "");

      (document.activeElement as HTMLElement).blur();
    }
  };

  return (
    <Container maxW="1400px" m="auto" py={10}>
      <ProfileForm
        ref={profileFormRef}
        onSubmit={onSubmit}
        defaultValues={data}
      />
    </Container>
  );
};

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const api = getAPIClient(ctx);
  const { data } = await api.get("me");

  return {
    props: {
      data,
    },
  };
};

Me.getLayout = (app) => {
  return <PrivatePage title="Profile">{app}</PrivatePage>;
};

export default Me;
