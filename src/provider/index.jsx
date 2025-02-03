"use client"

import { store } from '../store/store'
import { Provider } from "react-redux";
import { ThemeProvider } from "@mui/material";
import theme from "@/styles/theme";
import { AppRouterCacheProvider } from "@mui/material-nextjs/v13-appRouter";

const index = ({children}) => {
  return (
      <Provider store = {store}>
          <AppRouterCacheProvider options={{ enableCssLayer: true }}>
            <ThemeProvider theme={theme}>{children}</ThemeProvider>
          </AppRouterCacheProvider>
        </Provider>
  )
}

export default index


