"use client"

import { useCallback } from "react"
import { useAppDispatch, useAppSelector } from "../store"
import * as marketplaceActions from "../store/slices/marketplaceSlice"
import * as historyActions from "../store/slices/historySlice"
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
      (data: any) => dispatch(marketplaceActions.commissionAgent(data)),
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
    categorySelection: useCallback((formData: any) => dispatch(agentBuilderActions.categorySelection(formData)), [dispatch]),
    saveAgent: useCallback((formData: any) => dispatch(agentBuilderActions.saveAgent(formData)), [dispatch]),
    simulateAgent: useCallback((formData: any) => dispatch(agentBuilderActions.simulateAgent(formData)), [dispatch]),
    deployAgent: useCallback((formData: any,id:any) => dispatch(agentBuilderActions.deployAgent({formData,id})), [dispatch]),
    sendChatMessage: useCallback(
      (data:any) => dispatch(agentBuilderActions.sendChatMessage(data)),
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
    fetchMyAgents: useCallback((userId:any) => dispatch(myAgentsActions.fetchMyAgents(userId)), [dispatch]),
    fetchMyAgent:  useCallback((data:any) => dispatch(myAgentsActions.fetchMyAgent(data)), [dispatch]),
    fetchMyAgentsStats: useCallback(() => dispatch(myAgentsActions.fetchMyAgentsStats()), [dispatch]),
    deployMyAgent: useCallback((agentId: string) => dispatch(myAgentsActions.deployMyAgent(agentId)), [dispatch]),
    stopMyAgent: useCallback((agentId: string) => dispatch(myAgentsActions.stopMyAgent(agentId)), [dispatch]),
    updateMyAgent:useCallback((data: any) => dispatch(myAgentsActions.updateMyAgent(data)), [dispatch]),
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
    login: useCallback(
      (data: { email: string; password: string; rememberMe: boolean }) => dispatch(authActions.login(data)),
      [dispatch],
    ),
    register: useCallback(
      (data: { name: string; email: string; password: string }) => dispatch(authActions.register(data)),
      [dispatch],
    ),
    registerWithWallet: useCallback(
      (data: { name: string }) => dispatch(authActions.registerWithWallet(data)),
      [dispatch],
    ),
    connectWallet: useCallback((data:any) => dispatch(authActions.connectWallet(data)), [dispatch]),
    disconnectWallet: useCallback(() => dispatch(authActions.disconnectWallet()), [dispatch]),
    fetchUserProfile: useCallback(() => dispatch(authActions.fetchUserProfile()), [dispatch]),
    updateUserProfile: useCallback(
      (profileData: any) => dispatch(authActions.updateUserProfile(profileData)),
      [dispatch],
    ),
    logout: useCallback(() => dispatch(authActions.logout()), [dispatch]),
    setWalletBalance: useCallback((balance: string) => dispatch(authActions.setWalletBalance(balance)), [dispatch]),
    getUserPrivatekey:useCallback((id: string) => dispatch(authActions.getUserPrivatekey(id)), [dispatch]),
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

  // History actions
  const history = {
    fetchHistoryItems: useCallback(() => dispatch(historyActions.fetchHistoryItems()), [dispatch]),
    fetchHistoryStats: useCallback(() => dispatch(historyActions.fetchHistoryStats()), [dispatch]),
    fetchHistoryItemDetails: useCallback(
      (itemId: string) => dispatch(historyActions.fetchHistoryItemDetails(itemId)),
      [dispatch],
    ),
    downloadHistoryReport: useCallback(
      (itemId: string) => dispatch(historyActions.downloadHistoryReport(itemId)),
      [dispatch],
    ),
    deleteHistoryItem: useCallback((itemId: string) => dispatch(historyActions.deleteHistoryItem(itemId)), [dispatch]),
    setSearchQuery: useCallback((query: string) => dispatch(historyActions.setSearchQuery(query)), [dispatch]),
    setSelectedPeriod: useCallback((period: string) => dispatch(historyActions.setSelectedPeriod(period)), [dispatch]),
    setSelectedStatus: useCallback((status: string) => dispatch(historyActions.setSelectedStatus(status)), [dispatch]),
    resetFilters: useCallback(() => dispatch(historyActions.resetFilters()), [dispatch]),
    selectHistoryItem: useCallback((itemId: string) => dispatch(historyActions.selectHistoryItem(itemId)), [dispatch]),
    clearSelectedItem: useCallback(() => dispatch(historyActions.clearSelectedItem()), [dispatch]),
  }

  return {
    marketplace,
    agentBuilder,
    myAgents,
    lpDashboard,
    auth,
    settings,
    history,
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
    tools:useAppSelector((state) => state.agentBuilder.tools),
    capabilities:useAppSelector((state) => state.agentBuilder.capabilities),
    formData: useAppSelector((state) => state.agentBuilder.formData),
    isLoading: useAppSelector((state) => state.agentBuilder.isLoading),
    isChatLoading:useAppSelector((state) => state.agentBuilder.isChatLoading),
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
    userID:useAppSelector((state) => state.auth.userID),
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

  // History selectors
  const history = {
    items: useAppSelector((state) => state.history.items),
    filteredItems: useAppSelector((state) => state.history.filteredItems),
    stats: useAppSelector((state) => state.history.stats),
    filters: useAppSelector((state) => state.history.filters),
    selectedItem: useAppSelector((state) => state.history.selectedItem),
    loading: useAppSelector((state) => state.history.loading),
    error: useAppSelector((state) => state.history.error),
  }

  return {
    marketplace,
    agentBuilder,
    myAgents,
    lpDashboard,
    auth,
    settings,
    history,
  }
}

