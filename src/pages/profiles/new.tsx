import PrivatePage from "@/layouts/PrivatePage";
import { Container } from "@chakra-ui/react";
import React, { ReactElement, useRef } from "react";
import { NextPageWithLayout } from "../_app";
import api, { httpErrorHandler } from "@/services/api";
import { SubmitHandler } from "react-hook-form";
import {
  FormValues,
  ProfilesFormRefType,
} from "@/components/forms/ProfilesForm/ProfilesForm";
import { useRouter } from "next/router";
import omit from "lodash.omit";
import { toast } from "react-toastify";
import { ProfileData } from "@/typings/profile";
import ProfilesForm from "@/components/forms/ProfilesForm";

type Props = {
  data: ProfileData;
};

type AxiosResponseData = {
  newProfile: ProfileData;
};

const ProfilesId: NextPageWithLayout<Props> = ({ data }) => {
  const router = useRouter();
  const formRef = useRef<ProfilesFormRefType>(null);

  const onSubmit: SubmitHandler<FormValues> = async (values) => {
    const apiValues = omit(values, ["id", "created_at"]);
    try {
      const { data } = await api.post<AxiosResponseData>("profiles", apiValues);
      toast.success("Profile created succesfully!");
      router.push(`/profiles/${data.newProfile.id}`);
    } catch (error) {
      httpErrorHandler(error, formRef.current?.setError);
    }
  };

  return (
    <Container maxW="1400px" m="auto" py={10}>
      <ProfilesForm ref={formRef} onSubmit={onSubmit} defaultValues={data} />
    </Container>
  );
};

ProfilesId.getLayout = (page: ReactElement) => {
  return <PrivatePage>{page}</PrivatePage>;
};

export default ProfilesId;
