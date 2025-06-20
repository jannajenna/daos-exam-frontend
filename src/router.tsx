import {
  createRootRoute,
  createRoute,
  createRouter,
  Outlet,
} from '@tanstack/react-router';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Profile from './pages/Profile';
import EditProfile from './pages/EditProfile';
import EnsemblePage from './pages/EnsemblePage';
import CreateEnsemble from './pages/CreateEnsemble';
import CreatePost from './pages/CreatePost';
import PostPage from './pages/PostPage';
import FindPostsPage from './pages/FindPostPage';
import AllEnsemblesPage from './pages/AllEnsemblesPage';
import ProtectedRoute from './components/Protectedroute';

const rootRoute = createRootRoute({
  component: () => <Outlet />,
});

// create the wrapper route
const protectedRoute = createRoute({
  getParentRoute: () => rootRoute,
  id: 'protected',
  component: ProtectedRoute,
});

// Route: /
const landingRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: Landing,
});

//Register user
const registerRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/register',
  component: Register,
});

//Log in
const loginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/login',
  component: Login,
});

//Profile page 
const profileRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/profile/$id', // TanStack uses $ for route params
  component: Profile,
});

//Edit profile - protected route
const editProfileRoute = createRoute({
  getParentRoute: () => protectedRoute, // 🔒 PROTECTED
  path: '/edit-profile/$id',
  component: EditProfile,
});

//Ensemble 
const ensembleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ensembles/$id',
  component: EnsemblePage,
});

//Create Ensemble
const createEnsembleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ensembles/create',
  component: CreateEnsemble,
});

//Create Post
const createPostRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ensembles/$id/create-post',
  component: CreatePost,
});

//Post page
const postRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/posts/$id',
  component: PostPage,
});

//List of posts
const findPostsRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/posts',
  component: FindPostsPage,
});

const allEnsemblesRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/ensembles',
  component: AllEnsemblesPage,
});

const routeTree = rootRoute.addChildren([
  landingRoute,
  registerRoute,
  loginRoute,
  profileRoute,
  editProfileRoute,
  ensembleRoute,
  createEnsembleRoute,
  createPostRoute,
  findPostsRoute,
  postRoute,
  allEnsemblesRoute,
  protectedRoute,
]);


export const router = createRouter({ routeTree });
