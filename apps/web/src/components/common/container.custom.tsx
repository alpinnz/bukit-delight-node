import type { ComponentProps } from "react";
import { useEffect } from "react";
import { Container } from "@material-ui/core";

type ContainerCustomProps = ComponentProps<typeof Container> & {
  title?: string;
};

const ContainerCustom = ({
  title,
  children,
  ...props
}: ContainerCustomProps) => {
  useEffect(() => {
    document.title = `${title || ""}`;
  }, [title]);

  return (
    <Container style={{ minHeight: "100vh" }} component="main" {...props}>
      {children}
    </Container>
  );
};

export default ContainerCustom;
