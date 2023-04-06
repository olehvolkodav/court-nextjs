import { NextPageWithLayout } from "@/interfaces/page.type";
import { AdminLayout } from "@/layouts/admin.layout";
import { DashboardLayout } from "@/layouts/dashboard.layout";
import { DefaultLayout } from "@/layouts/default.layout";
import { CampaignLayout } from "@/layouts/sub-layout/campaign.layout";
import { SettingLayout } from "@/layouts/sub-layout/setting.layout";
import React from "react";

export const withDashboardLayout = (Component: NextPageWithLayout, title?: string) => {
  Component.getLayout = (page) => (
    <DashboardLayout title={title}>{page}</DashboardLayout>
  )

  return Component
}

export const withAdminLayout = (Component: NextPageWithLayout, title?: string) => {
  Component.getLayout = (page) => (
    <AdminLayout title={title}>{page}</AdminLayout>
  )

  return Component;
}

export const withCampaignLayout = (Component: NextPageWithLayout, title?: string) => {
  Component.getLayout = (page) => (
    <AdminLayout title={title}>
      <CampaignLayout>{page}</CampaignLayout>
    </AdminLayout>
  )

  return Component;
}

export const withLayout = (Component: NextPageWithLayout, title?: string) => {
  Component.getLayout = (page) => (
    <DefaultLayout>
      {page}
    </DefaultLayout>
  )

  return Component;
}

export const withSettingLayout = (Component: NextPageWithLayout, title?: string) => {
  Component.getLayout = (page) => (
    <AdminLayout title={title}>
      <SettingLayout>
        {page}
      </SettingLayout>
    </AdminLayout>
  )

  return Component;
}
