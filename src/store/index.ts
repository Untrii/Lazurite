import { reactive } from '@/util/reactivity'
import Store from './Store'
import StoreLoader from './StoreLoader'
import NavigationActions from './actions/Navigation'
import UtilActions from './actions/Util'
import DesignActions from './actions/Design'
import ConstructorActions from './actions/Constructor'
import WorkspaceActions from './actions/Workspace'
import ConstructorGetters from './getters/Constructor'
import WorkspaceGetters from './getters/Workspace'
import ToolGetters from './getters/Tools'
import EventBus from './EventBus'

export const raw = new Store()
  .use(new StoreLoader())
  .use(new ConstructorActions())
  .use(new DesignActions())
  .use(new NavigationActions())
  .use(new UtilActions())
  .use(new WorkspaceActions())
  .use(new ConstructorGetters())
  .use(new ToolGetters())
  .use(new WorkspaceGetters())
  .use(new EventBus())
type StoreType = typeof raw

export { StoreType }

const reactiveStore = reactive(raw)
reactiveStore.load()

export default reactiveStore
window['store'] = reactiveStore
