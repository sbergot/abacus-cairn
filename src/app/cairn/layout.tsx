import ClientLayout from "./client-layout";

export const metadata = {
  title: "Abacus - Cairn",
  description: "Mapless VTT",
};

// client layout must be defined in another file because exporting metadata
// only work in server components.
const Layout = ClientLayout;

export default Layout;