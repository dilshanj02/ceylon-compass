import SignupForm from "../components/SignupForm";

const SignupPage = () => {
  return (
    <>
      <section className="flex flex-col items-center justify-center text-center py-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Create an Account
        </h1>
      </section>
      <SignupForm />
    </>
  );
};

export default SignupPage;
