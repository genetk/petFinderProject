import prompts from "prompts";
import {
  PetNameResponse,
  PetTypeResponse,
  PetGenderResponse,
  PetDetail,
  Status,
} from "./type";
import { localStorage } from "./app";

export async function getPetData() {
  try {
    const petnameResponse: PetNameResponse = await prompts({
      type: "text",
      name: "pet_name",
      message: "please enter animal name",
    });
    const petTypeResponse: PetTypeResponse = await prompts({
      type: "select",
      name: "pet_type",
      message: "Select the animal type",
      choices: [
        {
          title: "Dog",
          value: "Dog",
        },
        {
          title: "Cat",
          value: "Cat",
        },
      ],
    });

    const petGenderResponse: PetGenderResponse = await prompts({
      type: "select",
      name: "pet_gender",
      message: "Select the animal gender",
      choices: [
        {
          title: "Male",
          value: "Male",
        },
        {
          title: "Female",
          value: "Female",
        },
      ],
    });
    console.log("petgenderresponse", typeof petGenderResponse);
    const petstatus: Status = await prompts({
      type: "select",
      name: "pet_status",
      message: "select animal status",
      choices: [
        {
          title: "adoptable",
          value: "adoptable",
        },
        {
          title: "adopted",

          value: "adopted",
        },
      ],
    });
    console.log("the status typeis", typeof petstatus);
    //console.log(petstatus);
    const url = "https://api.petfinder.com/v2/animals";

    let queryParam = "?";
    if (petnameResponse.pet_name) {
      queryParam += `name=${petnameResponse.pet_name}`;
    }
    queryParam += `&type=${petTypeResponse.pet_type}`;

    queryParam += `&gender=${petGenderResponse.pet_gender}`;
    queryParam += `&status=${petstatus.pet_status}`;
    console.log(queryParam);

    const accessToken = localStorage.getItem("access_token");

    const rawResponse: Response = await fetch(`${url}${queryParam}`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    const responseBody: {
      animals: Array<{ id: number; name: string; status: string }>;
    } = await rawResponse.json();

    await displayNames();
    async function displayNames() {
      try {
        const petListResponse: { id: number } = await prompts({
          type: "select",
          name: "id",
          message: "what animal do u want ",
          choices: responseBody.animals.map((animal) => ({
            title: `${animal.name},${animal.status}`,
            value: animal.id,
          })),
        });

        const url = "https://api.petfinder.com/v2/animals/";

        const pet_id = petListResponse.id;

        const rawUser_id: Response = await fetch(`${url}${pet_id}`, {
          method: "GET",
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        });

        const petDetail: { animal: PetDetail } = await rawUser_id.json();

        console.log(`Name: ${petDetail.animal.name}`);
        console.log(`Breeds: ${petDetail.animal.breeds.primary}`);
        console.log(`Size: ${petDetail.animal.size}`);
        console.log(`Age: ${petDetail.animal.age}`);
        console.log(`Colors: ${petDetail.animal.colors.primary}`);
        console.log(`Status: ${petDetail.animal.status}`);
      } catch (error) {
        console.error(error);
      }
    }

    await displayNames();
  } catch (error) {
    console.error(error);
  }
}
getPetData();
