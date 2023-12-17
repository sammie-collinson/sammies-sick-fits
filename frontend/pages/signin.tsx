import styled from "styled-components";
import RequestPasswordReset from "../components/RequestReset";
import SignUpFormik from "../components/SignUpFormik";
import SignInFormik from "../components/SignInFormik";

const GridStyles = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  grid-gap: 2rem;
`;

export default function SignInPage() {
  return (
    <GridStyles>
      <SignInFormik />
      <SignUpFormik />
      {/* <RequestPasswordReset /> */}
    </GridStyles>
  );
}
