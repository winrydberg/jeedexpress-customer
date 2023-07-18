interface MatchedSubsStrings {
  length: number;
  offset: number;
}

interface StructuredFormatting {
  main_text: string;
  main_text_matched_substrings: Array<Array<Object>>;
  secondary_text: string;
}

interface Terms {
  offset: number;
  value: string;
}

interface LatLngLocation {
  lat: any;
  lng: any;
}

interface Geometry {
  location: LatLngLocation;
  viewport: any;
}

interface Details {
  id: string;
  name: string;
  place_id: string;
  reference: string;
  adr_address: string;
  formatted_address: string;
  vicinity: string;
  icon: string;
  plus_code: any;
  types: Array<any>;
  utc_offset: number;
  address_components: Array<any>;
  scope: any;
  url: string;
  geometry: Geometry | null;
}

class GoogleLocation {
  public description: string = '';
  public matched_substrings: Array<MatchedSubsStrings> = [];
  public placeId: string = '';
  public reference: string = '';
  public terms: Array<Terms> = [];
  public types: Array<string> = [];
  public details: Details | null = null;

  constructor(
    description: string,
    matched_substrings: Array<MatchedSubsStrings>,
    placeId: string,
    reference: string,
    terms: Array<Terms>,
    types: Array<string>,
    details: Details | null,
  ) {
    this.description = description;
    this.matched_substrings = matched_substrings;
    this.placeId = placeId;
    this.reference = reference;
    this.terms = terms;
    this.types = types;
    this.details = details;
  }
}

export default GoogleLocation;
