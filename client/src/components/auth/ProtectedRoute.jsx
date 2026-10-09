import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useGetMeQuery } from "../../redux/apiSlice";
import ErrorState from "../common/ErrorState";
import PageLoader from "../common/PageLoader";

const ProtectedRoute = () => {
  const location = useLocation();
  const { data: user, isLoading, isError, error, refetch } = useGetMeQuery();

  if (isLoading) {
    return <PageLoader fullScreen />;
  }

  if (isError && error.status !== 401) {
    return (
      <div className="flex min-h-screen items-center justify-center p-6">
        <ErrorState title="Oturum doğrulanamadı" onRetry={refetch} />
      </div>
    );
  }

  if (isError || !user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
