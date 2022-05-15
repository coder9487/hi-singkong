import { createStore } from "vuex";

const Market = {
  namespaced: true,

  state: () => ({
    marketDisplay: [{ id: "None", display: false }],
    tutorialIndex: 0,
    distoryScene:false,
    Fozzy3D: false,
  }),
  mutations: {
    ResetTutorialDialog(state){
      state.tutorialIndex = 0
    },
    distoryScene(state){
        state.distoryScene = true
    },
    setFozzyFram(state, available) {
      state.Fozzy3D = available;
    },
    resetmarketChangeState(state) {
      state.marketDisplay = [{ id: "None", display: false }];
    },
    IncreaseTutorialDialog(state) {
      state.tutorialIndex++;
    },
    marketChangeState(state, person) {
      state.marketDisplay.splice(0, 1, person);
    },
  },
  actions: {},
  getters: {},
};

const Swordfish = {
  namespaced: true,
  state: () => ({
    swordfish: 0,
    gameEnable: false,
    Fozzy3D: false,
    hit: false,
  }),
  mutations: {
    Reset(state) {
      state.swordfish = 0;
      state.gameEnable = false;
      state.Fozzy3D = false;
      state.hit = false;
    },
    Hit(state) {
      state.hit = !state.hit;
    },
    setFozzyFram(state, available) {
      state.Fozzy3D = available;
    },
    ShootSwordfish(state) {
      state.swordfish++;
    },
    ToggleGame(state) {
      state.gameEnable = !state.gameEnable;
    },
    clearResult(state) {
      state.swordfish = 0;
    },
  },
  actions: {},
  getters: {
    GameEnable: (state) => {
      return state.gameEnable;
    },
  },
};

const DiningTable = {
  namespaced: true,
  state: () => ({
    dish: "",
    lightboxEnable: false,
    akonEnable: false,
    Fozzy3D: false,
  }),
  mutations: {
    setFozzyFram(state, available) {
      state.Fozzy3D = available;
    },
    SelectDish(state, dish) {
      state.dish = dish;
    },
    TogglelightboxEnable(state) {
      state.lightboxEnable = !state.lightboxEnable;
    },
    resetDish(state) {
      state.dish = "";
    },
    toggleAkon(state, enable) {
      state.akonEnable = enable;
    },
  },
  actions: {},
  getters: {
    getDish: (state) => state.dish,
  },
};

const Pisirian = {
  namespaced: true,
  state: () => ({
    toggledPasserby: "",
    end: false,
    Fozzy3D: false,
  }),
  mutations: {
    setFozzyFram(state, available) {
      state.Fozzy3D = available;
    },
    setTogglePasserby(state, sequen) {
      state.toggledPasserby = sequen;
    },
    toEnd(state) {
      state.end = true;
    },
  },
  actions: {},
  getters: {},
};

export default createStore({
  state: {
    Fozzy3D: false,
    Forward: false,
    gameStart: false,
    CameraDirect: { x: 0, y: 0 },
  },
  mutations: {
    gameStart(state) {
      state.gameStart = true;
    },
    setFozzyFram(state, available) {
      state.Fozzy3D = available;
    },
    setLookDir(state, objects) {
      state.CameraDirect.x = objects.x;
      state.CameraDirect.y = objects.y;
    },
    setForward(state, statment) {
      state.Forward = statment;
    },
  },
  modules: {
    Market: Market,
    Swordfish: Swordfish,
    DiningTable: DiningTable,
    Pisirian: Pisirian,
  },
});