import { supabase } from "./supabaseClient";

export default async function addBreachToDB(
    scanResult: {
      Name: any;
      Title: any;
      Domain: any;
      BreachDate: any;
      AddedDate: any;
      ModifiedDate: any;
      PwnCount: any;
      Description: any;
      DataClasses: any[];
      LogoPath: any;
      IsVerified: any;
      IsFabricated: any;
      IsSensitive: any;
      IsSpamList: any;
      IsMalware: any;
    }[],
    uid: string | undefined
  ) {
    try {
      for (const result of scanResult) {
        const { data, error } = await supabase.from("Breach").upsert(
          [
            {
              Name: result.Name,
              Title: result.Title,
              Domain: result.Domain,
              BreachDate: result.BreachDate,
              AddedDate: result.AddedDate,
              ModifiedDate: result.ModifiedDate,
              PwnCount: result.PwnCount,
              Description: result.Description,
              LogoPath: result.LogoPath,
              IsVerified: result.IsVerified,
              IsFabricated: result.IsFabricated,
              IsSensitive: result.IsSensitive,
              IsSpamList: result.IsSpamList,
              IsMalware: result.IsMalware,
              dataClasses: result.DataClasses,
            },
          ],
          {
            onConflict: "Name",
          }
        );

        if (error) {
          console.error("Error in addBreachToDB:", error.message);
        } else {
          
          // console.log((await supabase.auth.getUser()))
          if (uid) {
            const userBreachInsert = await supabase
              .from("User_Breaches")
              .upsert({
                user_identifier: uid,
                breach_identifier: result.Name,
                IsAcknowledged: false,
              });
            if (userBreachInsert.error) {
              throw Error(userBreachInsert.error.message);
            } else {
              // console.log('added user breach data')
            }
          }
          // console.log('addBreachToDB data:', data);
        }
      }

      return { message: "Success" };
    } catch (error) {
      console.error("Error in addBreachToDB:", error);
      return { error: error };
    }
  }
