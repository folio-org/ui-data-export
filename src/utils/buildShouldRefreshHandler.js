export const buildShouldRefreshHandler = resourcesActionsToPrevent => (_, action) => {
  return !Object.entries(resourcesActionsToPrevent).some(([resourceName, actionTypes]) => (
    resourceName === action.meta.name &&
    actionTypes.some(actionType => action.meta?.originatingActionType.includes(actionType))));
};
