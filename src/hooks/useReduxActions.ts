"use client"

import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../store"
import * as marketplaceActions from "../store/slices/marketplaceSlice"
import * as agentBuilderActions from "../store/slices/agentBuilderSlice"
import * as myAgentsActions from "../store/slices/myAgentsSlice"
import * as lpDashboardActions from "../store/slices/lpDashboardSlice"
import * as authActions from "../store/slices/authSlice"
import * as settingsActions from "../store/slices/settingsSlice"

// Custom hook to provide easy access to all Redux actions
export const useReduxActions = () => {
  const dispatch = useAppDispatch()

  // Marketplace actions
  const marketplace = {
    fetchAgents: useCallback(() => dispatch(marketplaceActions.fetchAgents()), [dispatch]),
    fetchStats: useCallback(() => dispatch(marketplaceActions.fetchMarketplaceStats()), [dispatch]),
    commissionAgent: useCallback(
      (agentId: string) => dispatch(marketplaceActions.commissionAgent(agentId)),
      [dispatch],
    ),
    setSearchQuery: useCallback((query: string) => dispatch(marketplaceActions.setSearchQuery(query)), [dispatch]),
    setSelectedStrategy: useCallback(
      (strategy: string) => dispatch(marketplaceActions.setSelectedStrategy(strategy)),
      [dispatch],
    ),
    setSelectedRiskLevel: useCallback(
      (level: string) => dispatch(marketplaceActions.setSelectedRiskLevel(level)),
      [dispatch],
    ),
    setSelectedSort: useCallback((sort: string) => dispatch(marketplaceActions.setSelectedSort(sort)), [dispatch]),
    setSelectedTimePeriod: useCallback(
      (period: string) => dispatch(marketplaceActions.setSelectedTimePeriod(period)),
      [dispatch],
    ),
    setSelectedTags: useCallback((tags: string[]) => dispatch(marketplaceActions.setSelectedTags(tags)), [dispatch]),
    resetFilters: useCallback(() => dispatch(marketplaceActions.resetFilters()), [dispatch]),
  }

  // Agent Builder actions
  const agentBuilder = {
    saveAgent: useCallback((formData: any) => dispatch(agentBuilderActions.saveAgent(formData)), [dispatch]),
    simulateAgent: useCallback((formData: any) => dispatch(agentBuilderActions.simulateAgent(formData)), [dispatch]),
    deployAgent: useCallback((formData: any) => dispatch(agentBuilderActions.deployAgent(formData)), [dispatch]),
    sendChatMessage: useCallback(
      (agentId: string, message: string) => dispatch(agentBuilderActions.sendChatMessage({ agentId, message })),
      [dispatch],
    ),
    fetchSavedAgents: useCallback(() => dispatch(agentBuilderActions.fetchSavedAgents()), [dispatch]),
    updateFormField: useCallback(
      (field: string, value: any) => dispatch(agentBuilderActions.updateFormField({ field: field as any, value })),
      [dispatch],
    ),
    toggleCapability: useCallback(
      (capability: string) => dispatch(agentBuilderActions.toggleCapability(capability)),
      [dispatch],
    ),
    toggleTool: useCallback((tool: string) => dispatch(agentBuilderActions.toggleTool(tool)), [dispatch]),
    addChatMessage: useCallback((message: any) => dispatch(agentBuilderActions.addChatMessage(message)), [dispatch]),
    resetChat: useCallback(() => dispatch(agentBuilderActions.resetChat()), [dispatch]),
    resetAgentBuilder: useCallback(() => dispatch(agentBuilderActions.resetAgentBuilder()), [dispatch]),
  }

  // My Agents actions
  const myAgents = {
    fetchMyAgents: useCallback(() => dispatch(myAgentsActions.fetchMyAgents()), [dispatch]),
    fetchMyAgentsStats: useCallback(() => dispatch(myAgentsActions.fetchMyAgentsStats()), [dispatch]),
    deployMyAgent: useCallback((agentId: string) => dispatch(myAgentsActions.deployMyAgent(agentId)), [dispatch]),
    stopMyAgent: useCallback((agentId: string) => dispatch(myAgentsActions.stopMyAgent(agentId)), [dispatch]),
    deleteMyAgent: useCallback((agentId: string) => dispatch(myAgentsActions.deleteMyAgent(agentId)), [dispatch]),
    duplicateMyAgent: useCallback((agentId: string) => dispatch(myAgentsActions.duplicateMyAgent(agentId)), [dispatch]),
    setSearchQuery: useCallback((query: string) => dispatch(myAgentsActions.setSearchQuery(query)), [dispatch]),
    setSelectedFilter: useCallback((filter: string) => dispatch(myAgentsActions.setSelectedFilter(filter)), [dispatch]),
    setSelectedSort: useCallback((sort: string) => dispatch(myAgentsActions.setSelectedSort(sort)), [dispatch]),
    resetFilters: useCallback(() => dispatch(myAgentsActions.resetFilters()), [dispatch]),
  }

  // LP Dashboard actions
  const lpDashboard = {
    fetchLPDashboardData: useCallback(() => dispatch(lpDashboardActions.fetchLPDashboardData()), [dispatch]),
    // fetchPoolsData: useCallback((chain?: string) => dispatch(lpDashboardActions.fetchPoolsData(chain)), [dispatch]),
    fetchRewardsData: useCallback(() => dispatch(lpDashboardActions.fetchRewardsData()), [dispatch]),
    // fetchPerformanceData: useCallback((timeframe: string) => [dispatch]),
    fetchPerformanceData: useCallback(
      (timeframe: string) => dispatch(lpDashboardActions.fetchPerformanceData(timeframe)),
      [dispatch],
    ),
    claimReward: useCallback((rewardId: string) => dispatch(lpDashboardActions.claimReward(rewardId)), [dispatch]),
    addLiquidity: useCallback((data: any) => dispatch(lpDashboardActions.addLiquidity(data)), [dispatch]),
    removeLiquidity: useCallback((poolId: string) => dispatch(lpDashboardActions.removeLiquidity(poolId)), [dispatch]),
    setSelectedTimeframe: useCallback(
      (timeframe: string) => dispatch(lpDashboardActions.setSelectedTimeframe(timeframe)),
      [dispatch],
    ),
    setSelectedChain: useCallback((chain: string) => dispatch(lpDashboardActions.setSelectedChain(chain)), [dispatch]),
  }

  // Auth actions
  const auth = {
    connectWallet: useCallback(() => dispatch(authActions.connectWallet()), [dispatch]),
    disconnectWallet: useCallback(() => dispatch(authActions.disconnectWallet()), [dispatch]),
    fetchUserProfile: useCallback(() => dispatch(authActions.fetchUserProfile()), [dispatch]),
    updateUserProfile: useCallback(
      (profileData: any) => dispatch(authActions.updateUserProfile(profileData)),
      [dispatch],
    ),
    logout: useCallback(() => dispatch(authActions.logout()), [dispatch]),
    setWalletBalance: useCallback((balance: string) => dispatch(authActions.setWalletBalance(balance)), [dispatch]),
  }

  // Settings actions
  const settings = {
    fetchSettings: useCallback(() => dispatch(settingsActions.fetchSettings()), [dispatch]),
    updateSettings: useCallback((settings: any) => dispatch(settingsActions.updateSettings(settings)), [dispatch]),
    generateNewApiKey: useCallback(() => dispatch(settingsActions.generateNewApiKey()), [dispatch]),
    toggleTwoFactorAuth: useCallback(
      (enable: boolean) => dispatch(settingsActions.toggleTwoFactorAuth(enable)),
      [dispatch],
    ),
    changePassword: useCallback(
      (data: { currentPassword: string; newPassword: string }) => dispatch(settingsActions.changePassword(data)),
      [dispatch],
    ),
    toggleDarkMode: useCallback(() => dispatch(settingsActions.toggleDarkMode()), [dispatch]),
    updateNotificationSetting: useCallback(
      (key: string, value: boolean) => dispatch(settingsActions.updateNotificationSetting({ key: key as any, value })),
      [dispatch],
    ),
  }

  return {
    marketplace,
    agentBuilder,
    myAgents,
    lpDashboard,
    auth,
    settings,
  }
}

// Custom hook to provide easy access to all Redux selectors
export const useReduxSelectors = () => {
  // Marketplace selectors
  const marketplace = {
    agents: useAppSelector((state) => state.marketplace.agents),
    filteredAgents: useAppSelector((state) => state.marketplace.filteredAgents),
    stats: useAppSelector((state) => state.marketplace.stats),
    filters: useAppSelector((state) => state.marketplace.filters),
    loading: useAppSelector((state) => state.marketplace.loading),
    error: useAppSelector((state) => state.marketplace.error),
  }

  // Agent Builder selectors
  const agentBuilder = {
    formData: useAppSelector((state) => state.agentBuilder.formData),
    isLoading: useAppSelector((state) => state.agentBuilder.isLoading),
    isDeployed: useAppSelector((state) => state.agentBuilder.isDeployed),
    deployedAgent: useAppSelector((state) => state.agentBuilder.deployedAgent),
    chatMessages: useAppSelector((state) => state.agentBuilder.chatMessages),
    error: useAppSelector((state) => state.agentBuilder.error),
    savedAgents: useAppSelector((state) => state.agentBuilder.savedAgents),
    simulationResults: useAppSelector((state) => state.agentBuilder.simulationResults),
  }

  // My Agents selectors
  const myAgents = {
    agents: useAppSelector((state) => state.myAgents.agents),
    filteredAgents: useAppSelector((state) => state.myAgents.filteredAgents),
    stats: useAppSelector((state) => state.myAgents.stats),
    filters: useAppSelector((state) => state.myAgents.filters),
    loading: useAppSelector((state) => state.myAgents.loading),
    error: useAppSelector((state) => state.myAgents.error),
  }

  // LP Dashboard selectors
  const lpDashboard = {
    overview: useAppSelector((state) => state.lpDashboard.overview),
    pools: useAppSelector((state) => state.lpDashboard.pools),
    filteredPools: useAppSelector((state) => state.lpDashboard.filteredPools),
    rewards: useAppSelector((state) => state.lpDashboard.rewards),
    selectedTimeframe: useAppSelector((state) => state.lpDashboard.selectedTimeframe),
    selectedChain: useAppSelector((state) => state.lpDashboard.selectedChain),
    performanceData: useAppSelector((state) => state.lpDashboard.performanceData),
    loading: useAppSelector((state) => state.lpDashboard.loading),
    error: useAppSelector((state) => state.lpDashboard.error),
  }

  // Auth selectors
  const auth = {
    isAuthenticated: useAppSelector((state) => state.auth.isAuthenticated),
    isWalletConnected: useAppSelector((state) => state.auth.isWalletConnected),
    walletAddress: useAppSelector((state) => state.auth.walletAddress),
    walletBalance: useAppSelector((state) => state.auth.walletBalance),
    userProfile: useAppSelector((state) => state.auth.userProfile),
    loading: useAppSelector((state) => state.auth.loading),
    error: useAppSelector((state) => state.auth.error),
  }

  // Settings selectors
  const settings = {
    darkMode: useAppSelector((state) => state.settings.darkMode),
    notifications: useAppSelector((state) => state.settings.notifications),
    apiKey: useAppSelector((state) => state.settings.apiKey),
    twoFactorEnabled: useAppSelector((state) => state.settings.twoFactorEnabled),
    loading: useAppSelector((state) => state.settings.loading),
    error: useAppSelector((state) => state.settings.error),
  }

  return {
    marketplace,
    agentBuilder,
    myAgents,
    lpDashboard,
    auth,
    settings,
  }
}

