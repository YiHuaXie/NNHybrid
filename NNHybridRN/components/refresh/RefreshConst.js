// 默认刷新控件高度
export const defaultHeight = 60;

// 下拉刷新状态
export const HeaderRefreshState = {
    Idle: 'Idle',
    Pulling: 'Pulling',
    Refreshing: 'Refreshing',
}

// 加载更多状态
export const FooterRefreshState = {
    Idle: 'Idle',
    Refreshing: 'Refreshing',
    NoMoreData: 'NoMoreData',
    EmptyData: 'EmptyData',
    Failure: 'Failure',
}

// 下拉刷新默认props
export const defaultHeaderProps = {
    // headerRefreshState: HeaderRefreshState.Idle,
    headerIsRefreshing: false,
    headerHeight: defaultHeight,
    headerIdleText: '下拉可以刷新',
    headerPullingText: '松开立即刷新',
    headerRefreshingText: '正在刷新数据中...',
}

// 加载更多默认props
export const defaultFooterProps = {
    footerRefreshState: FooterRefreshState.Idle,
    footerHeight: defaultHeight,
    footerRefreshingText: '更多数据加载中...',
    footerFailureText: '点击重新加载',
    footerNoMoreDataText: '已加载全部数据',
    footerEmptyDataText: '暂时没有相关数据',
}
