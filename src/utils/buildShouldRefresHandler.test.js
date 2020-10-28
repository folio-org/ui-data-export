import { buildShouldRefreshHandler } from './buildShouldRefreshHandler';

describe('buildShouldRefreshHandler', () => {
  const resourcesActionsToPrevent = { customResource: ['DELETE', 'POST'] };

  it('should allow refresh if resourcesActionsToPrevent doesn\'t cover action', () => {
    const actionWithDifferentName = {
      meta: {
        name: 'someResource',
        originatingActionType: 'POST_RESOURCE',
      },
    };

    const actionWithDifferentActionType = {
      meta: {
        name: 'customResource',
        originatingActionType: 'PUT_RESOURCE',
      },
    };

    expect(buildShouldRefreshHandler(resourcesActionsToPrevent)(null, actionWithDifferentName)).toBe(true);
    expect(buildShouldRefreshHandler(resourcesActionsToPrevent)(null, actionWithDifferentActionType)).toBe(true);
  });

  it('should disallow refresh if resourcesActionsToPrevent covers action', () => {
    const action = {
      meta: {
        name: 'customResource',
        originatingActionType: 'POST_RESOURCE',
      },
    };

    expect(buildShouldRefreshHandler(resourcesActionsToPrevent)(null, action)).toBe(false);
  });
});
