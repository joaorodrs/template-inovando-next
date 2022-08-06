import ProfilesTable from "@/components/tables/ProfilesTable";
import PrivatePage from "@/layouts/PrivatePage";
import { Container } from "@chakra-ui/react";
import React, { ReactElement } from "react";
import { NextPageWithLayout } from "../_app";

const Profiles: NextPageWithLayout = () => {
  return (
    <Container maxWidth="1400px" m="auto" py={10}>
      <ProfilesTable />
    </Container>
  );
};

Profiles.getLayout = function getLayout(page: ReactElement) {
  return <PrivatePage title="Profiles">{page}</PrivatePage>;
};

export default Profiles;
