export type JWTType = { exp: number; aud: string; jti: string };

export type TokenResponse = {
  token_type: string;
  expires_in: number;
  access_token: string;
};

export type PetNameResponse = {
  pet_name: string;
};

export type PetTypeResponse = {
  pet_type: [{ title: string; value: string }];
};
export type PetGenderResponse = {
  pet_gender: [
    { title: "Male"; value: "Male" },
    { title: "Female"; value: "Female" }
  ];
};

export type PetDetail = {
  name: string;
  breeds: { primary: string };
  size: string;
  age: string;
  colors: { primary: string };
  status: string;
};

export type BookmarkResponse = {
  pet_bookmark: string;
  choices: [{ title: string; value: string }];
};

export type Bookmarks = { [id: string]: string };

export type Status = {
  pet_status: "adoptable" | "adopted";
};
