import { PlaceType } from './place-type';
import Lamp from './lamp';
import MovingObject from './moving-object';
import Junction from './junction';
import Road from './road';
import { MovingObjectType } from './moving-object-type';

/**
 * Klasa reprezentująca zrzut stanu symulacji (jedna iteracja symulacji).
 */
export default class SmartCityModel {

  /**
   * Konstruktor klasy. Inicjalizuje listy obiektów w symulacji.
   */
  constructor() {
      this.junctions = [];
      this.lampList = [];
      this.objects = [];
      this.roads = [];
      this.place = PlaceType.NormalTraffic;
  }
  /**
   * lista wszystkich lamp w symulacji
   */
  lampList: Lamp[];
  /**
   * lista wszystkich obiektów dynamicznych w danym czasie symulacji
   */
  objects: MovingObject[];
  /**
   * lista wszystkich skrzyżowań w symulacji
   */
  junctions: Junction[];
  /**
   * lista wszystkich ścieżek w symulacji
   */
  roads: Road[];
  /**
   * całkowite zużycie energii w sytuacji, gdy nie jest wykorzystany system inteligentnego oświetlenia
   */
  totalEnergyUsage = 0;
  /**
   * całkowite zużycie energii w sytuacji, gdy jest wykorzystany system inteligentnego oświetlenia
   */
  totalEnergyNormalUsage = 0;
  /**
   * całkowita oszczędność pieniędzy w przypadku wykorzystania systemu inteligentnego oświetlenia
   */
  savedMoney = 0.0;
  /**
   * buffor cenowy, pozwalający np. na symulację kosztów instalacji systemu
   */
  priceBuffor = 0.0;
  /**
   * wybrany scenariusz symulacji
   */
  place: PlaceType;

   /**
   * Statyczna metoda tworząca kopię(nie referencję!) obiektu modelu.
   * @param model obiekt przeznaczony do kopiowania
   * @returns nowy obiekt modelu
   */
  static from(model: SmartCityModel): SmartCityModel {
      const result = new SmartCityModel();
      result.junctions = model.junctions.map(junction => Junction.from(junction));
      result.lampList = model.lampList.map(lamp => Lamp.from(lamp));
      result.objects = model.objects.map(object => MovingObject.from(object));
      result.roads = model.roads.map(road => Road.from(road));
      result.totalEnergyNormalUsage = model.totalEnergyNormalUsage;
      result.totalEnergyUsage = model.totalEnergyUsage;
      result.savedMoney = model.savedMoney;
      result.priceBuffor = model.priceBuffor;
      return result;
  }

  /**
   * Metoda tworząca kopię (nie referencję!) instancji klasy.
   * @returns nowy obiekt modelu
   */
  clone(): SmartCityModel {
      const model = new SmartCityModel();
      model.junctions = this.junctions.map(junction => junction.clone());
      model.lampList = this.lampList.map(lamp => lamp.clone());
      model.objects = this.objects.map(object => object.clone());
      model.roads = this.roads.map(road => road.clone());
      model.totalEnergyNormalUsage = this.totalEnergyNormalUsage;
      model.totalEnergyUsage = this.totalEnergyUsage;
      model.savedMoney = this.savedMoney;
      model.priceBuffor = this.priceBuffor;
      return model;
  }

  /**
   * Metoda zwraca liczbe pojazdów w danym czasie symulacji.
   * @returns liczba pojazdów
   */
  getCarCount(): number {
      return this.objects.filter(o => o.type === MovingObjectType.Car).length;
  }
}
