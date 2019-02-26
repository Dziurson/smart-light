import SmartCityModel from './smart-city-model';

/**
 * Klasa reprezentująca zrzut stanu symulacji (jedna, osadzona w czasie iteracja symulacji).
 */
export default class SimulationState {
  /**
   * timestamp określający moment w czasie, w którym symulacja była w stanie opisanym przez powyższy model (w sekundach)
   */
  timestamp: number;
  /**
   * model zawierający dane na temat stanu symulacji
   */
  state: SmartCityModel;
}
