import SigninForm from "../components/SigninForm";

const SigninPage = () => {
  return (
    <>
      <section className="flex flex-col items-center justify-center text-center py-10">
        <h1 className="text-4xl md:text-5xl font-bold mb-4">
          Welcome to Ceylon Compass
        </h1>
      </section>
      <SigninForm />
    </>
  );
};

export default SigninPage;
