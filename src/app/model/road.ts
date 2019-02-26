/**
 * Klasa reprezentująca ścieżkę po której poruszają się obiekty dynamiczne.
 */
export default class Road {
  /**
   * pozycja X początku ścieżki
   */
  startX: number;
  /**
   * pozycja Y początku ścieżki
   */
  startY: number;
  /**
   * pozycja X końca ścieżki
   */
  endX: number;
  /**
   * pozycja Y końca ścieżki
   */
  endY: number;

  /**
   * Konstruktor kopiujący.
   * @param startX pozycja X początku nowej ścieżki
   * @param startY pozycja Y początku nowej ścieżki
   * @param endX pozycja X końca nowej ścieżki
   * @param endY pozycja Y końca nowej ścieżki
   */
  constructor(startX: number, startY: number, endX: number, endY: number) {
      this.endX = endX;
      this.endY = endY;
      this.startX = startX;
      this.startY = startY;
  }

  /**
   * Statyczna metoda tworząca kopię(nie referencję!) obiektu ścieżki.
   * @param road obiekt przeznaczony do kopiowania
   * @returns nowy obiekt ścieżki
   */
  static from(road: Road): Road {
      return new Road(road.startX, road.startY, road.endX, road.endY);
  }

  /**
   * Metoda tworząca kopię (nie referencję!) instancji klasy.
   * @returns nowy obiekt ścieżki
   */
  clone(): Road {
      return new Road(this.startX, this.startY, this.endX, this.endY);
  }
}
