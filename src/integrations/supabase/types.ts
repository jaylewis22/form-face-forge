export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "13.0.5"
  }
  public: {
    Tables: {
      attributecategorymap: {
        Row: {
          attribute: string | null
          category: number | null
          gkcategory: number | null
          weight: number | null
        }
        Insert: {
          attribute?: string | null
          category?: number | null
          gkcategory?: number | null
          weight?: number | null
        }
        Update: {
          attribute?: string | null
          category?: number | null
          gkcategory?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      career_competitionprogress: {
        Row: {
          artificialkey: string | null
          compobjid: string | null
          compshortname: string | null
          cup_objective_result: string | null
          hasteamwon: string | null
          season: string | null
          stageid: string | null
          teamid: string | null
        }
        Insert: {
          artificialkey?: string | null
          compobjid?: string | null
          compshortname?: string | null
          cup_objective_result?: string | null
          hasteamwon?: string | null
          season?: string | null
          stageid?: string | null
          teamid?: string | null
        }
        Update: {
          artificialkey?: string | null
          compobjid?: string | null
          compshortname?: string | null
          cup_objective_result?: string | null
          hasteamwon?: string | null
          season?: string | null
          stageid?: string | null
          teamid?: string | null
        }
        Relationships: []
      }
      career_createplayerattributes: {
        Row: {
          acceleration: number | null
          agemax: number | null
          agemin: number | null
          aggression: number | null
          agility: number | null
          balance: number | null
          ballcontrol: number | null
          composure: number | null
          crossing: number | null
          curve: number | null
          defensiveawareness: number | null
          dribbling: number | null
          finishing: number | null
          freekickaccuracy: number | null
          gkdiving: number | null
          gkhandling: number | null
          gkkicking: number | null
          gkpositioning: number | null
          gkreflexes: number | null
          headingaccuracy: number | null
          interceptions: number | null
          jumping: number | null
          longpassing: number | null
          longshots: number | null
          overallmax: number | null
          overallmin: number | null
          penalties: number | null
          playerposgroup: string | null
          positioning: number | null
          potential: number | null
          reactions: number | null
          shortpassing: number | null
          shotpower: number | null
          slidingtackle: number | null
          sprintspeed: number | null
          stamina: number | null
          standingtackle: number | null
          strength: number | null
          vision: number | null
          volleys: number | null
        }
        Insert: {
          acceleration?: number | null
          agemax?: number | null
          agemin?: number | null
          aggression?: number | null
          agility?: number | null
          balance?: number | null
          ballcontrol?: number | null
          composure?: number | null
          crossing?: number | null
          curve?: number | null
          defensiveawareness?: number | null
          dribbling?: number | null
          finishing?: number | null
          freekickaccuracy?: number | null
          gkdiving?: number | null
          gkhandling?: number | null
          gkkicking?: number | null
          gkpositioning?: number | null
          gkreflexes?: number | null
          headingaccuracy?: number | null
          interceptions?: number | null
          jumping?: number | null
          longpassing?: number | null
          longshots?: number | null
          overallmax?: number | null
          overallmin?: number | null
          penalties?: number | null
          playerposgroup?: string | null
          positioning?: number | null
          potential?: number | null
          reactions?: number | null
          shortpassing?: number | null
          shotpower?: number | null
          slidingtackle?: number | null
          sprintspeed?: number | null
          stamina?: number | null
          standingtackle?: number | null
          strength?: number | null
          vision?: number | null
          volleys?: number | null
        }
        Update: {
          acceleration?: number | null
          agemax?: number | null
          agemin?: number | null
          aggression?: number | null
          agility?: number | null
          balance?: number | null
          ballcontrol?: number | null
          composure?: number | null
          crossing?: number | null
          curve?: number | null
          defensiveawareness?: number | null
          dribbling?: number | null
          finishing?: number | null
          freekickaccuracy?: number | null
          gkdiving?: number | null
          gkhandling?: number | null
          gkkicking?: number | null
          gkpositioning?: number | null
          gkreflexes?: number | null
          headingaccuracy?: number | null
          interceptions?: number | null
          jumping?: number | null
          longpassing?: number | null
          longshots?: number | null
          overallmax?: number | null
          overallmin?: number | null
          penalties?: number | null
          playerposgroup?: string | null
          positioning?: number | null
          potential?: number | null
          reactions?: number | null
          shortpassing?: number | null
          shotpower?: number | null
          slidingtackle?: number | null
          sprintspeed?: number | null
          stamina?: number | null
          standingtackle?: number | null
          strength?: number | null
          vision?: number | null
          volleys?: number | null
        }
        Relationships: []
      }
      career_growthcurveinfo: {
        Row: {
          mentalcurveid: string | null
          mentalcurveoffset: string | null
          physicalcurveid: string | null
          physicalcurveoffset: string | null
          playerid: string | null
          skillcurveid: string | null
          skillcurveoffset: string | null
        }
        Insert: {
          mentalcurveid?: string | null
          mentalcurveoffset?: string | null
          physicalcurveid?: string | null
          physicalcurveoffset?: string | null
          playerid?: string | null
          skillcurveid?: string | null
          skillcurveoffset?: string | null
        }
        Update: {
          mentalcurveid?: string | null
          mentalcurveoffset?: string | null
          physicalcurveid?: string | null
          physicalcurveoffset?: string | null
          playerid?: string | null
          skillcurveid?: string | null
          skillcurveoffset?: string | null
        }
        Relationships: []
      }
      career_managerpref: {
        Row: {
          boardaidifficulty: string | null
          boardfinancialstrictness: string | null
          bonuspercentage: string | null
          clubformation1: string | null
          clubformation2: string | null
          clubformation3: string | null
          clubformation4: string | null
          clubformation5: string | null
          currency: string | null
          halflength: string | null
          intlformation1: string | null
          intlformation2: string | null
          intlformation3: string | null
          intlformation4: string | null
          intlformation5: string | null
          managerprefid: string | null
          matchdifficulty: string | null
          playasaiteam: string | null
          refereestrictnesscareer: string | null
          skipfirsttransfer: string | null
          stadiumid: string | null
          startofseasonplayerwages: string | null
          startofseasontransferbudget: string | null
          startofseasonwagebudget: string | null
          transferbudget: string | null
          usedsquad: string | null
          wagebudget: string | null
        }
        Insert: {
          boardaidifficulty?: string | null
          boardfinancialstrictness?: string | null
          bonuspercentage?: string | null
          clubformation1?: string | null
          clubformation2?: string | null
          clubformation3?: string | null
          clubformation4?: string | null
          clubformation5?: string | null
          currency?: string | null
          halflength?: string | null
          intlformation1?: string | null
          intlformation2?: string | null
          intlformation3?: string | null
          intlformation4?: string | null
          intlformation5?: string | null
          managerprefid?: string | null
          matchdifficulty?: string | null
          playasaiteam?: string | null
          refereestrictnesscareer?: string | null
          skipfirsttransfer?: string | null
          stadiumid?: string | null
          startofseasonplayerwages?: string | null
          startofseasontransferbudget?: string | null
          startofseasonwagebudget?: string | null
          transferbudget?: string | null
          usedsquad?: string | null
          wagebudget?: string | null
        }
        Update: {
          boardaidifficulty?: string | null
          boardfinancialstrictness?: string | null
          bonuspercentage?: string | null
          clubformation1?: string | null
          clubformation2?: string | null
          clubformation3?: string | null
          clubformation4?: string | null
          clubformation5?: string | null
          currency?: string | null
          halflength?: string | null
          intlformation1?: string | null
          intlformation2?: string | null
          intlformation3?: string | null
          intlformation4?: string | null
          intlformation5?: string | null
          managerprefid?: string | null
          matchdifficulty?: string | null
          playasaiteam?: string | null
          refereestrictnesscareer?: string | null
          skipfirsttransfer?: string | null
          stadiumid?: string | null
          startofseasonplayerwages?: string | null
          startofseasontransferbudget?: string | null
          startofseasonwagebudget?: string | null
          transferbudget?: string | null
          usedsquad?: string | null
          wagebudget?: string | null
        }
        Relationships: []
      }
      career_newsban: {
        Row: {
          artificialkey: string | null
          compobjid: string | null
          newstype: string | null
          teamid: string | null
        }
        Insert: {
          artificialkey?: string | null
          compobjid?: string | null
          newstype?: string | null
          teamid?: string | null
        }
        Update: {
          artificialkey?: string | null
          compobjid?: string | null
          newstype?: string | null
          teamid?: string | null
        }
        Relationships: []
      }
      career_newspicweights: {
        Row: {
          crestweight: number | null
          genericweight: number | null
          maxvariationsneg: string | null
          maxvariationspos: string | null
          maxvariationsstd: number | null
          teamid: string | null
          teamweight: string | null
        }
        Insert: {
          crestweight?: number | null
          genericweight?: number | null
          maxvariationsneg?: string | null
          maxvariationspos?: string | null
          maxvariationsstd?: number | null
          teamid?: string | null
          teamweight?: string | null
        }
        Update: {
          crestweight?: number | null
          genericweight?: number | null
          maxvariationsneg?: string | null
          maxvariationspos?: string | null
          maxvariationsstd?: number | null
          teamid?: string | null
          teamweight?: string | null
        }
        Relationships: []
      }
      career_playasplayer: {
        Row: {
          lastwithdrawdate: string | null
          numloanrequests: string | null
          numtransferrequests: string | null
          numwithdrawrequests: string | null
          playedlastmatch: string | null
          playerid: string | null
          playerrequest: string | null
          position: string | null
          requestactiondays: string | null
          userid: string | null
        }
        Insert: {
          lastwithdrawdate?: string | null
          numloanrequests?: string | null
          numtransferrequests?: string | null
          numwithdrawrequests?: string | null
          playedlastmatch?: string | null
          playerid?: string | null
          playerrequest?: string | null
          position?: string | null
          requestactiondays?: string | null
          userid?: string | null
        }
        Update: {
          lastwithdrawdate?: string | null
          numloanrequests?: string | null
          numtransferrequests?: string | null
          numwithdrawrequests?: string | null
          playedlastmatch?: string | null
          playerid?: string | null
          playerrequest?: string | null
          position?: string | null
          requestactiondays?: string | null
          userid?: string | null
        }
        Relationships: []
      }
      career_playasplayerhistory: {
        Row: {
          appearances: string | null
          assists: string | null
          cleansheets: string | null
          clublevel: string | null
          continentalcuptrophies: string | null
          domesticcuptrophies: string | null
          draws: string | null
          fouls: string | null
          goals: string | null
          goalsconceded: string | null
          leagueid: string | null
          leaguetrophies: string | null
          loses: string | null
          matchratings: string | null
          motm: string | null
          overall: string | null
          passesontarget: string | null
          playasplayerhistoryid: string | null
          position: string | null
          saveattemps: string | null
          saves: string | null
          season: string | null
          shotsontarget: string | null
          tableposition: string | null
          tacklesontarget: string | null
          teamid: string | null
          totalpasses: string | null
          totalreds: string | null
          totalshots: string | null
          totaltackles: string | null
          totalyellows: string | null
          userid: string | null
          value: string | null
          wage: string | null
          wins: string | null
        }
        Insert: {
          appearances?: string | null
          assists?: string | null
          cleansheets?: string | null
          clublevel?: string | null
          continentalcuptrophies?: string | null
          domesticcuptrophies?: string | null
          draws?: string | null
          fouls?: string | null
          goals?: string | null
          goalsconceded?: string | null
          leagueid?: string | null
          leaguetrophies?: string | null
          loses?: string | null
          matchratings?: string | null
          motm?: string | null
          overall?: string | null
          passesontarget?: string | null
          playasplayerhistoryid?: string | null
          position?: string | null
          saveattemps?: string | null
          saves?: string | null
          season?: string | null
          shotsontarget?: string | null
          tableposition?: string | null
          tacklesontarget?: string | null
          teamid?: string | null
          totalpasses?: string | null
          totalreds?: string | null
          totalshots?: string | null
          totaltackles?: string | null
          totalyellows?: string | null
          userid?: string | null
          value?: string | null
          wage?: string | null
          wins?: string | null
        }
        Update: {
          appearances?: string | null
          assists?: string | null
          cleansheets?: string | null
          clublevel?: string | null
          continentalcuptrophies?: string | null
          domesticcuptrophies?: string | null
          draws?: string | null
          fouls?: string | null
          goals?: string | null
          goalsconceded?: string | null
          leagueid?: string | null
          leaguetrophies?: string | null
          loses?: string | null
          matchratings?: string | null
          motm?: string | null
          overall?: string | null
          passesontarget?: string | null
          playasplayerhistoryid?: string | null
          position?: string | null
          saveattemps?: string | null
          saves?: string | null
          season?: string | null
          shotsontarget?: string | null
          tableposition?: string | null
          tacklesontarget?: string | null
          teamid?: string | null
          totalpasses?: string | null
          totalreds?: string | null
          totalshots?: string | null
          totaltackles?: string | null
          totalyellows?: string | null
          userid?: string | null
          value?: string | null
          wage?: string | null
          wins?: string | null
        }
        Relationships: []
      }
      career_playercontract: {
        Row: {
          Column1: string | null
          Column10: string | null
          Column11: string | null
          Column12: string | null
          Column13: string | null
          Column14: string | null
          Column15: string | null
          Column2: string | null
          Column3: string | null
          Column4: string | null
          Column5: string | null
          Column6: string | null
          Column7: string | null
          Column8: string | null
          Column9: string | null
        }
        Insert: {
          Column1?: string | null
          Column10?: string | null
          Column11?: string | null
          Column12?: string | null
          Column13?: string | null
          Column14?: string | null
          Column15?: string | null
          Column2?: string | null
          Column3?: string | null
          Column4?: string | null
          Column5?: string | null
          Column6?: string | null
          Column7?: string | null
          Column8?: string | null
          Column9?: string | null
        }
        Update: {
          Column1?: string | null
          Column10?: string | null
          Column11?: string | null
          Column12?: string | null
          Column13?: string | null
          Column14?: string | null
          Column15?: string | null
          Column2?: string | null
          Column3?: string | null
          Column4?: string | null
          Column5?: string | null
          Column6?: string | null
          Column7?: string | null
          Column8?: string | null
          Column9?: string | null
        }
        Relationships: []
      }
      career_playergrowthuserseason: {
        Row: {
          acceleration: string | null
          aggression: string | null
          agility: string | null
          balance: string | null
          ballcontrol: string | null
          composure: string | null
          crossing: string | null
          curve: string | null
          defensiveawareness: string | null
          dribbling: string | null
          dribspeed: string | null
          finishing: string | null
          freekickaccuracy: string | null
          gkdiving: string | null
          gkhandling: string | null
          gkkicking: string | null
          gkpositioning: string | null
          gkreflexes: string | null
          headingaccuracy: string | null
          interceptions: string | null
          jumping: string | null
          longpassing: string | null
          longshots: string | null
          overall: string | null
          penalties: string | null
          playerid: string | null
          positioning: string | null
          reactions: string | null
          shortpassing: string | null
          shotpower: string | null
          slidingtackle: string | null
          sprintspeed: string | null
          stamina: string | null
          standingtackle: string | null
          strength: string | null
          vision: string | null
          volleys: string | null
        }
        Insert: {
          acceleration?: string | null
          aggression?: string | null
          agility?: string | null
          balance?: string | null
          ballcontrol?: string | null
          composure?: string | null
          crossing?: string | null
          curve?: string | null
          defensiveawareness?: string | null
          dribbling?: string | null
          dribspeed?: string | null
          finishing?: string | null
          freekickaccuracy?: string | null
          gkdiving?: string | null
          gkhandling?: string | null
          gkkicking?: string | null
          gkpositioning?: string | null
          gkreflexes?: string | null
          headingaccuracy?: string | null
          interceptions?: string | null
          jumping?: string | null
          longpassing?: string | null
          longshots?: string | null
          overall?: string | null
          penalties?: string | null
          playerid?: string | null
          positioning?: string | null
          reactions?: string | null
          shortpassing?: string | null
          shotpower?: string | null
          slidingtackle?: string | null
          sprintspeed?: string | null
          stamina?: string | null
          standingtackle?: string | null
          strength?: string | null
          vision?: string | null
          volleys?: string | null
        }
        Update: {
          acceleration?: string | null
          aggression?: string | null
          agility?: string | null
          balance?: string | null
          ballcontrol?: string | null
          composure?: string | null
          crossing?: string | null
          curve?: string | null
          defensiveawareness?: string | null
          dribbling?: string | null
          dribspeed?: string | null
          finishing?: string | null
          freekickaccuracy?: string | null
          gkdiving?: string | null
          gkhandling?: string | null
          gkkicking?: string | null
          gkpositioning?: string | null
          gkreflexes?: string | null
          headingaccuracy?: string | null
          interceptions?: string | null
          jumping?: string | null
          longpassing?: string | null
          longshots?: string | null
          overall?: string | null
          penalties?: string | null
          playerid?: string | null
          positioning?: string | null
          reactions?: string | null
          shortpassing?: string | null
          shotpower?: string | null
          slidingtackle?: string | null
          sprintspeed?: string | null
          stamina?: string | null
          standingtackle?: string | null
          strength?: string | null
          vision?: string | null
          volleys?: string | null
        }
        Relationships: []
      }
      career_playerlastgrowth: {
        Row: {
          growthdate: string | null
          initialcurveoffset: string | null
          injurydate: string | null
          injuryduration: string | null
          playerid: string | null
        }
        Insert: {
          growthdate?: string | null
          initialcurveoffset?: string | null
          injurydate?: string | null
          injuryduration?: string | null
          playerid?: string | null
        }
        Update: {
          growthdate?: string | null
          initialcurveoffset?: string | null
          injurydate?: string | null
          injuryduration?: string | null
          playerid?: string | null
        }
        Relationships: []
      }
      career_presignedcontract: {
        Row: {
          Column1: string | null
          Column10: string | null
          Column11: string | null
          Column12: string | null
          Column13: string | null
          Column14: string | null
          Column15: string | null
          Column16: string | null
          Column17: string | null
          Column18: string | null
          Column19: string | null
          Column2: string | null
          Column20: string | null
          Column21: string | null
          Column22: string | null
          Column3: string | null
          Column4: string | null
          Column5: string | null
          Column6: string | null
          Column7: string | null
          Column8: string | null
          Column9: string | null
        }
        Insert: {
          Column1?: string | null
          Column10?: string | null
          Column11?: string | null
          Column12?: string | null
          Column13?: string | null
          Column14?: string | null
          Column15?: string | null
          Column16?: string | null
          Column17?: string | null
          Column18?: string | null
          Column19?: string | null
          Column2?: string | null
          Column20?: string | null
          Column21?: string | null
          Column22?: string | null
          Column3?: string | null
          Column4?: string | null
          Column5?: string | null
          Column6?: string | null
          Column7?: string | null
          Column8?: string | null
          Column9?: string | null
        }
        Update: {
          Column1?: string | null
          Column10?: string | null
          Column11?: string | null
          Column12?: string | null
          Column13?: string | null
          Column14?: string | null
          Column15?: string | null
          Column16?: string | null
          Column17?: string | null
          Column18?: string | null
          Column19?: string | null
          Column2?: string | null
          Column20?: string | null
          Column21?: string | null
          Column22?: string | null
          Column3?: string | null
          Column4?: string | null
          Column5?: string | null
          Column6?: string | null
          Column7?: string | null
          Column8?: string | null
          Column9?: string | null
        }
        Relationships: []
      }
      career_regenplayerattributes: {
        Row: {
          acceleration: number | null
          age: number | null
          aggression: number | null
          agility: number | null
          balance: number | null
          ballcontrol: number | null
          composure: number | null
          crossing: number | null
          curve: number | null
          defensiveawareness: number | null
          dribbling: number | null
          finishing: number | null
          freekickaccuracy: number | null
          gkdiving: number | null
          gkhandling: number | null
          gkkicking: number | null
          gkpositioning: number | null
          gkreflexes: number | null
          headingaccuracy: number | null
          interceptions: number | null
          jumping: number | null
          longpassing: number | null
          longshots: number | null
          overall: number | null
          penalties: number | null
          playerposgroup: string | null
          positioning: number | null
          reactions: number | null
          shortpassing: number | null
          shotpower: number | null
          slidingtackle: number | null
          sprintspeed: number | null
          stamina: number | null
          standingtackle: number | null
          strength: number | null
          vision: number | null
          volleys: number | null
        }
        Insert: {
          acceleration?: number | null
          age?: number | null
          aggression?: number | null
          agility?: number | null
          balance?: number | null
          ballcontrol?: number | null
          composure?: number | null
          crossing?: number | null
          curve?: number | null
          defensiveawareness?: number | null
          dribbling?: number | null
          finishing?: number | null
          freekickaccuracy?: number | null
          gkdiving?: number | null
          gkhandling?: number | null
          gkkicking?: number | null
          gkpositioning?: number | null
          gkreflexes?: number | null
          headingaccuracy?: number | null
          interceptions?: number | null
          jumping?: number | null
          longpassing?: number | null
          longshots?: number | null
          overall?: number | null
          penalties?: number | null
          playerposgroup?: string | null
          positioning?: number | null
          reactions?: number | null
          shortpassing?: number | null
          shotpower?: number | null
          slidingtackle?: number | null
          sprintspeed?: number | null
          stamina?: number | null
          standingtackle?: number | null
          strength?: number | null
          vision?: number | null
          volleys?: number | null
        }
        Update: {
          acceleration?: number | null
          age?: number | null
          aggression?: number | null
          agility?: number | null
          balance?: number | null
          ballcontrol?: number | null
          composure?: number | null
          crossing?: number | null
          curve?: number | null
          defensiveawareness?: number | null
          dribbling?: number | null
          finishing?: number | null
          freekickaccuracy?: number | null
          gkdiving?: number | null
          gkhandling?: number | null
          gkkicking?: number | null
          gkpositioning?: number | null
          gkreflexes?: number | null
          headingaccuracy?: number | null
          interceptions?: number | null
          jumping?: number | null
          longpassing?: number | null
          longshots?: number | null
          overall?: number | null
          penalties?: number | null
          playerposgroup?: string | null
          positioning?: number | null
          reactions?: number | null
          shortpassing?: number | null
          shotpower?: number | null
          slidingtackle?: number | null
          sprintspeed?: number | null
          stamina?: number | null
          standingtackle?: number | null
          strength?: number | null
          vision?: number | null
          volleys?: number | null
        }
        Relationships: []
      }
      career_scoutmission: {
        Row: {
          durationid: string | null
          missioncost: string | null
          nationality: string | null
          playerposition: string | null
          playertype: string | null
          preferredposition1: string | null
          preferredposition2: string | null
          preferredposition3: string | null
          preferredposition4: string | null
          preferredrole1: string | null
          preferredrole2: string | null
          preferredrole3: string | null
          returningdate: string | null
          scoutid: string | null
        }
        Insert: {
          durationid?: string | null
          missioncost?: string | null
          nationality?: string | null
          playerposition?: string | null
          playertype?: string | null
          preferredposition1?: string | null
          preferredposition2?: string | null
          preferredposition3?: string | null
          preferredposition4?: string | null
          preferredrole1?: string | null
          preferredrole2?: string | null
          preferredrole3?: string | null
          returningdate?: string | null
          scoutid?: string | null
        }
        Update: {
          durationid?: string | null
          missioncost?: string | null
          nationality?: string | null
          playerposition?: string | null
          playertype?: string | null
          preferredposition1?: string | null
          preferredposition2?: string | null
          preferredposition3?: string | null
          preferredposition4?: string | null
          preferredrole1?: string | null
          preferredrole2?: string | null
          preferredrole3?: string | null
          returningdate?: string | null
          scoutid?: string | null
        }
        Relationships: []
      }
      career_scouts: {
        Row: {
          experience: string | null
          firstname: string | null
          knowledge: string | null
          lastname: string | null
          nationality: string | null
          regionid: string | null
          scoutid: string | null
          state: string | null
        }
        Insert: {
          experience?: string | null
          firstname?: string | null
          knowledge?: string | null
          lastname?: string | null
          nationality?: string | null
          regionid?: string | null
          scoutid?: string | null
          state?: string | null
        }
        Update: {
          experience?: string | null
          firstname?: string | null
          knowledge?: string | null
          lastname?: string | null
          nationality?: string | null
          regionid?: string | null
          scoutid?: string | null
          state?: string | null
        }
        Relationships: []
      }
      career_squadranking: {
        Row: {
          curroverall: string | null
          lastoverall: string | null
          playerid: string | null
        }
        Insert: {
          curroverall?: string | null
          lastoverall?: string | null
          playerid?: string | null
        }
        Update: {
          curroverall?: string | null
          lastoverall?: string | null
          playerid?: string | null
        }
        Relationships: []
      }
      career_transferblock: {
        Row: {
          permanent: string | null
          playerid: string | null
        }
        Insert: {
          permanent?: string | null
          playerid?: string | null
        }
        Update: {
          permanent?: string | null
          playerid?: string | null
        }
        Relationships: []
      }
      career_youthplayerattributes: {
        Row: {
          acceleration: number | null
          age: number | null
          aggression: number | null
          agility: number | null
          balance: number | null
          ballcontrol: number | null
          composure: number | null
          crossing: number | null
          curve: number | null
          defensiveawareness: number | null
          dribbling: number | null
          finishing: number | null
          freekickaccuracy: number | null
          gkdiving: number | null
          gkhandling: number | null
          gkkicking: number | null
          gkpositioning: number | null
          gkreflexes: number | null
          headingaccuracy: number | null
          interceptions: number | null
          jumping: number | null
          longpassing: number | null
          longshots: number | null
          penalties: number | null
          playertier: string | null
          playertype: string | null
          positioning: number | null
          potential: number | null
          reactions: number | null
          shortpassing: number | null
          shotpower: number | null
          slidingtackle: number | null
          sprintspeed: number | null
          stamina: number | null
          standingtackle: number | null
          strength: number | null
          vision: number | null
          volleys: number | null
        }
        Insert: {
          acceleration?: number | null
          age?: number | null
          aggression?: number | null
          agility?: number | null
          balance?: number | null
          ballcontrol?: number | null
          composure?: number | null
          crossing?: number | null
          curve?: number | null
          defensiveawareness?: number | null
          dribbling?: number | null
          finishing?: number | null
          freekickaccuracy?: number | null
          gkdiving?: number | null
          gkhandling?: number | null
          gkkicking?: number | null
          gkpositioning?: number | null
          gkreflexes?: number | null
          headingaccuracy?: number | null
          interceptions?: number | null
          jumping?: number | null
          longpassing?: number | null
          longshots?: number | null
          penalties?: number | null
          playertier?: string | null
          playertype?: string | null
          positioning?: number | null
          potential?: number | null
          reactions?: number | null
          shortpassing?: number | null
          shotpower?: number | null
          slidingtackle?: number | null
          sprintspeed?: number | null
          stamina?: number | null
          standingtackle?: number | null
          strength?: number | null
          vision?: number | null
          volleys?: number | null
        }
        Update: {
          acceleration?: number | null
          age?: number | null
          aggression?: number | null
          agility?: number | null
          balance?: number | null
          ballcontrol?: number | null
          composure?: number | null
          crossing?: number | null
          curve?: number | null
          defensiveawareness?: number | null
          dribbling?: number | null
          finishing?: number | null
          freekickaccuracy?: number | null
          gkdiving?: number | null
          gkhandling?: number | null
          gkkicking?: number | null
          gkpositioning?: number | null
          gkreflexes?: number | null
          headingaccuracy?: number | null
          interceptions?: number | null
          jumping?: number | null
          longpassing?: number | null
          longshots?: number | null
          penalties?: number | null
          playertier?: string | null
          playertype?: string | null
          positioning?: number | null
          potential?: number | null
          reactions?: number | null
          shortpassing?: number | null
          shotpower?: number | null
          slidingtackle?: number | null
          sprintspeed?: number | null
          stamina?: number | null
          standingtackle?: number | null
          strength?: number | null
          vision?: number | null
          volleys?: number | null
        }
        Relationships: []
      }
      career_youthplayerhistory: {
        Row: {
          appearances: string | null
          goals: string | null
          playerid: string | null
        }
        Insert: {
          appearances?: string | null
          goals?: string | null
          playerid?: string | null
        }
        Update: {
          appearances?: string | null
          goals?: string | null
          playerid?: string | null
        }
        Relationships: []
      }
      career_youthplayerposattributes: {
        Row: {
          acceleration: number | null
          age: number | null
          aggression: number | null
          agility: number | null
          balance: number | null
          ballcontrol: number | null
          composure: number | null
          crossing: number | null
          curve: number | null
          defensiveawareness: number | null
          dribbling: number | null
          finishing: number | null
          freekickaccuracy: number | null
          gkdiving: number | null
          gkhandling: number | null
          gkkicking: number | null
          gkpositioning: number | null
          gkreflexes: number | null
          headingaccuracy: number | null
          interceptions: number | null
          jumping: number | null
          longpassing: number | null
          longshots: number | null
          penalties: number | null
          playerposgroup: string | null
          positioning: number | null
          potential: number | null
          reactions: number | null
          shortpassing: number | null
          shotpower: number | null
          slidingtackle: number | null
          sprintspeed: number | null
          stamina: number | null
          standingtackle: number | null
          strength: number | null
          vision: number | null
          volleys: number | null
        }
        Insert: {
          acceleration?: number | null
          age?: number | null
          aggression?: number | null
          agility?: number | null
          balance?: number | null
          ballcontrol?: number | null
          composure?: number | null
          crossing?: number | null
          curve?: number | null
          defensiveawareness?: number | null
          dribbling?: number | null
          finishing?: number | null
          freekickaccuracy?: number | null
          gkdiving?: number | null
          gkhandling?: number | null
          gkkicking?: number | null
          gkpositioning?: number | null
          gkreflexes?: number | null
          headingaccuracy?: number | null
          interceptions?: number | null
          jumping?: number | null
          longpassing?: number | null
          longshots?: number | null
          penalties?: number | null
          playerposgroup?: string | null
          positioning?: number | null
          potential?: number | null
          reactions?: number | null
          shortpassing?: number | null
          shotpower?: number | null
          slidingtackle?: number | null
          sprintspeed?: number | null
          stamina?: number | null
          standingtackle?: number | null
          strength?: number | null
          vision?: number | null
          volleys?: number | null
        }
        Update: {
          acceleration?: number | null
          age?: number | null
          aggression?: number | null
          agility?: number | null
          balance?: number | null
          ballcontrol?: number | null
          composure?: number | null
          crossing?: number | null
          curve?: number | null
          defensiveawareness?: number | null
          dribbling?: number | null
          finishing?: number | null
          freekickaccuracy?: number | null
          gkdiving?: number | null
          gkhandling?: number | null
          gkkicking?: number | null
          gkpositioning?: number | null
          gkreflexes?: number | null
          headingaccuracy?: number | null
          interceptions?: number | null
          jumping?: number | null
          longpassing?: number | null
          longshots?: number | null
          penalties?: number | null
          playerposgroup?: string | null
          positioning?: number | null
          potential?: number | null
          reactions?: number | null
          shortpassing?: number | null
          shotpower?: number | null
          slidingtackle?: number | null
          sprintspeed?: number | null
          stamina?: number | null
          standingtackle?: number | null
          strength?: number | null
          vision?: number | null
          volleys?: number | null
        }
        Relationships: []
      }
      career_youthplayers: {
        Row: {
          monthsinsquad: string | null
          playerid: string | null
          playertier: string | null
          playertype: string | null
          potentialvariance: string | null
          swinglowpotential: string | null
        }
        Insert: {
          monthsinsquad?: string | null
          playerid?: string | null
          playertier?: string | null
          playertype?: string | null
          potentialvariance?: string | null
          swinglowpotential?: string | null
        }
        Update: {
          monthsinsquad?: string | null
          playerid?: string | null
          playertier?: string | null
          playertype?: string | null
          potentialvariance?: string | null
          swinglowpotential?: string | null
        }
        Relationships: []
      }
      celebrations: {
        Row: {
          celebrationid: string | null
        }
        Insert: {
          celebrationid?: string | null
        }
        Update: {
          celebrationid?: string | null
        }
        Relationships: []
      }
      cm_default_mentalities: {
        Row: {
          buildupplay: string | null
          defensivedepth: string | null
          formationaudioid: string | null
          formationfullnameid: string | null
          mentalityid: string | null
          offset0x: string | null
          offset0y: string | null
          offset10x: string | null
          offset10y: string | null
          offset1x: string | null
          offset1y: string | null
          offset2x: string | null
          offset2y: string | null
          offset3x: string | null
          offset3y: string | null
          offset4x: string | null
          offset4y: string | null
          offset5x: string | null
          offset5y: string | null
          offset6x: string | null
          offset6y: string | null
          offset7x: string | null
          offset7y: string | null
          offset8x: string | null
          offset8y: string | null
          offset9x: string | null
          offset9y: string | null
          playerid0: string | null
          playerid1: string | null
          playerid10: string | null
          playerid2: string | null
          playerid3: string | null
          playerid4: string | null
          playerid5: string | null
          playerid6: string | null
          playerid7: string | null
          playerid8: string | null
          playerid9: string | null
          position0: string | null
          position1: string | null
          position10: string | null
          position2: string | null
          position3: string | null
          position4: string | null
          position5: string | null
          position6: string | null
          position7: string | null
          position8: string | null
          position9: string | null
          sourceformationid: string | null
          teamid: string | null
        }
        Insert: {
          buildupplay?: string | null
          defensivedepth?: string | null
          formationaudioid?: string | null
          formationfullnameid?: string | null
          mentalityid?: string | null
          offset0x?: string | null
          offset0y?: string | null
          offset10x?: string | null
          offset10y?: string | null
          offset1x?: string | null
          offset1y?: string | null
          offset2x?: string | null
          offset2y?: string | null
          offset3x?: string | null
          offset3y?: string | null
          offset4x?: string | null
          offset4y?: string | null
          offset5x?: string | null
          offset5y?: string | null
          offset6x?: string | null
          offset6y?: string | null
          offset7x?: string | null
          offset7y?: string | null
          offset8x?: string | null
          offset8y?: string | null
          offset9x?: string | null
          offset9y?: string | null
          playerid0?: string | null
          playerid1?: string | null
          playerid10?: string | null
          playerid2?: string | null
          playerid3?: string | null
          playerid4?: string | null
          playerid5?: string | null
          playerid6?: string | null
          playerid7?: string | null
          playerid8?: string | null
          playerid9?: string | null
          position0?: string | null
          position1?: string | null
          position10?: string | null
          position2?: string | null
          position3?: string | null
          position4?: string | null
          position5?: string | null
          position6?: string | null
          position7?: string | null
          position8?: string | null
          position9?: string | null
          sourceformationid?: string | null
          teamid?: string | null
        }
        Update: {
          buildupplay?: string | null
          defensivedepth?: string | null
          formationaudioid?: string | null
          formationfullnameid?: string | null
          mentalityid?: string | null
          offset0x?: string | null
          offset0y?: string | null
          offset10x?: string | null
          offset10y?: string | null
          offset1x?: string | null
          offset1y?: string | null
          offset2x?: string | null
          offset2y?: string | null
          offset3x?: string | null
          offset3y?: string | null
          offset4x?: string | null
          offset4y?: string | null
          offset5x?: string | null
          offset5y?: string | null
          offset6x?: string | null
          offset6y?: string | null
          offset7x?: string | null
          offset7y?: string | null
          offset8x?: string | null
          offset8y?: string | null
          offset9x?: string | null
          offset9y?: string | null
          playerid0?: string | null
          playerid1?: string | null
          playerid10?: string | null
          playerid2?: string | null
          playerid3?: string | null
          playerid4?: string | null
          playerid5?: string | null
          playerid6?: string | null
          playerid7?: string | null
          playerid8?: string | null
          playerid9?: string | null
          position0?: string | null
          position1?: string | null
          position10?: string | null
          position2?: string | null
          position3?: string | null
          position4?: string | null
          position5?: string | null
          position6?: string | null
          position7?: string | null
          position8?: string | null
          position9?: string | null
          sourceformationid?: string | null
          teamid?: string | null
        }
        Relationships: []
      }
      cm_mentalities: {
        Row: {
          activetactic: string | null
          artificialkey: string | null
          buildupplay: string | null
          code: string | null
          defensivedepth: string | null
          formationaudioid: string | null
          formationfullnameid: string | null
          mentalityid: string | null
          offset0x: string | null
          offset0y: string | null
          offset10x: string | null
          offset10y: string | null
          offset1x: string | null
          offset1y: string | null
          offset2x: string | null
          offset2y: string | null
          offset3x: string | null
          offset3y: string | null
          offset4x: string | null
          offset4y: string | null
          offset5x: string | null
          offset5y: string | null
          offset6x: string | null
          offset6y: string | null
          offset7x: string | null
          offset7y: string | null
          offset8x: string | null
          offset8y: string | null
          offset9x: string | null
          offset9y: string | null
          playerid0: string | null
          playerid1: string | null
          playerid10: string | null
          playerid2: string | null
          playerid3: string | null
          playerid4: string | null
          playerid5: string | null
          playerid6: string | null
          playerid7: string | null
          playerid8: string | null
          playerid9: string | null
          pos0role: string | null
          pos10role: string | null
          pos1role: string | null
          pos2role: string | null
          pos3role: string | null
          pos4role: string | null
          pos5role: string | null
          pos6role: string | null
          pos7role: string | null
          pos8role: string | null
          pos9role: string | null
          position0: string | null
          position1: string | null
          position10: string | null
          position2: string | null
          position3: string | null
          position4: string | null
          position5: string | null
          position6: string | null
          position7: string | null
          position8: string | null
          position9: string | null
          presetid: string | null
          sourceformationid: string | null
          tactic_name: string | null
          teamid: string | null
          teamsheetid: string | null
        }
        Insert: {
          activetactic?: string | null
          artificialkey?: string | null
          buildupplay?: string | null
          code?: string | null
          defensivedepth?: string | null
          formationaudioid?: string | null
          formationfullnameid?: string | null
          mentalityid?: string | null
          offset0x?: string | null
          offset0y?: string | null
          offset10x?: string | null
          offset10y?: string | null
          offset1x?: string | null
          offset1y?: string | null
          offset2x?: string | null
          offset2y?: string | null
          offset3x?: string | null
          offset3y?: string | null
          offset4x?: string | null
          offset4y?: string | null
          offset5x?: string | null
          offset5y?: string | null
          offset6x?: string | null
          offset6y?: string | null
          offset7x?: string | null
          offset7y?: string | null
          offset8x?: string | null
          offset8y?: string | null
          offset9x?: string | null
          offset9y?: string | null
          playerid0?: string | null
          playerid1?: string | null
          playerid10?: string | null
          playerid2?: string | null
          playerid3?: string | null
          playerid4?: string | null
          playerid5?: string | null
          playerid6?: string | null
          playerid7?: string | null
          playerid8?: string | null
          playerid9?: string | null
          pos0role?: string | null
          pos10role?: string | null
          pos1role?: string | null
          pos2role?: string | null
          pos3role?: string | null
          pos4role?: string | null
          pos5role?: string | null
          pos6role?: string | null
          pos7role?: string | null
          pos8role?: string | null
          pos9role?: string | null
          position0?: string | null
          position1?: string | null
          position10?: string | null
          position2?: string | null
          position3?: string | null
          position4?: string | null
          position5?: string | null
          position6?: string | null
          position7?: string | null
          position8?: string | null
          position9?: string | null
          presetid?: string | null
          sourceformationid?: string | null
          tactic_name?: string | null
          teamid?: string | null
          teamsheetid?: string | null
        }
        Update: {
          activetactic?: string | null
          artificialkey?: string | null
          buildupplay?: string | null
          code?: string | null
          defensivedepth?: string | null
          formationaudioid?: string | null
          formationfullnameid?: string | null
          mentalityid?: string | null
          offset0x?: string | null
          offset0y?: string | null
          offset10x?: string | null
          offset10y?: string | null
          offset1x?: string | null
          offset1y?: string | null
          offset2x?: string | null
          offset2y?: string | null
          offset3x?: string | null
          offset3y?: string | null
          offset4x?: string | null
          offset4y?: string | null
          offset5x?: string | null
          offset5y?: string | null
          offset6x?: string | null
          offset6y?: string | null
          offset7x?: string | null
          offset7y?: string | null
          offset8x?: string | null
          offset8y?: string | null
          offset9x?: string | null
          offset9y?: string | null
          playerid0?: string | null
          playerid1?: string | null
          playerid10?: string | null
          playerid2?: string | null
          playerid3?: string | null
          playerid4?: string | null
          playerid5?: string | null
          playerid6?: string | null
          playerid7?: string | null
          playerid8?: string | null
          playerid9?: string | null
          pos0role?: string | null
          pos10role?: string | null
          pos1role?: string | null
          pos2role?: string | null
          pos3role?: string | null
          pos4role?: string | null
          pos5role?: string | null
          pos6role?: string | null
          pos7role?: string | null
          pos8role?: string | null
          pos9role?: string | null
          position0?: string | null
          position1?: string | null
          position10?: string | null
          position2?: string | null
          position3?: string | null
          position4?: string | null
          position5?: string | null
          position6?: string | null
          position7?: string | null
          position8?: string | null
          position9?: string | null
          presetid?: string | null
          sourceformationid?: string | null
          tactic_name?: string | null
          teamid?: string | null
          teamsheetid?: string | null
        }
        Relationships: []
      }
      cm_teamsheets: {
        Row: {
          artificialkey: string | null
          captainid: string | null
          cksupport1: string | null
          cksupport2: string | null
          cksupport3: string | null
          customsub0in: string | null
          customsub0out: string | null
          customsub1in: string | null
          customsub1out: string | null
          customsub2in: string | null
          customsub2out: string | null
          isfavourite: string | null
          leftcornerkicktakerid: string | null
          leftfreekicktakerid: string | null
          longkicktakerid: string | null
          penaltytakerid: string | null
          playerid0: string | null
          playerid1: string | null
          playerid10: string | null
          playerid11: string | null
          playerid12: string | null
          playerid13: string | null
          playerid14: string | null
          playerid15: string | null
          playerid16: string | null
          playerid17: string | null
          playerid18: string | null
          playerid19: string | null
          playerid2: string | null
          playerid20: string | null
          playerid21: string | null
          playerid22: string | null
          playerid23: string | null
          playerid24: string | null
          playerid25: string | null
          playerid26: string | null
          playerid27: string | null
          playerid28: string | null
          playerid29: string | null
          playerid3: string | null
          playerid30: string | null
          playerid31: string | null
          playerid32: string | null
          playerid33: string | null
          playerid34: string | null
          playerid35: string | null
          playerid36: string | null
          playerid37: string | null
          playerid38: string | null
          playerid39: string | null
          playerid4: string | null
          playerid40: string | null
          playerid41: string | null
          playerid42: string | null
          playerid43: string | null
          playerid44: string | null
          playerid45: string | null
          playerid46: string | null
          playerid47: string | null
          playerid48: string | null
          playerid49: string | null
          playerid5: string | null
          playerid50: string | null
          playerid51: string | null
          playerid6: string | null
          playerid7: string | null
          playerid8: string | null
          playerid9: string | null
          profileid: string | null
          rightcornerkicktakerid: string | null
          rightfreekicktakerid: string | null
          sourceformationid: string | null
          teamid: string | null
          teamsheetid: string | null
          teamsheetname: string | null
        }
        Insert: {
          artificialkey?: string | null
          captainid?: string | null
          cksupport1?: string | null
          cksupport2?: string | null
          cksupport3?: string | null
          customsub0in?: string | null
          customsub0out?: string | null
          customsub1in?: string | null
          customsub1out?: string | null
          customsub2in?: string | null
          customsub2out?: string | null
          isfavourite?: string | null
          leftcornerkicktakerid?: string | null
          leftfreekicktakerid?: string | null
          longkicktakerid?: string | null
          penaltytakerid?: string | null
          playerid0?: string | null
          playerid1?: string | null
          playerid10?: string | null
          playerid11?: string | null
          playerid12?: string | null
          playerid13?: string | null
          playerid14?: string | null
          playerid15?: string | null
          playerid16?: string | null
          playerid17?: string | null
          playerid18?: string | null
          playerid19?: string | null
          playerid2?: string | null
          playerid20?: string | null
          playerid21?: string | null
          playerid22?: string | null
          playerid23?: string | null
          playerid24?: string | null
          playerid25?: string | null
          playerid26?: string | null
          playerid27?: string | null
          playerid28?: string | null
          playerid29?: string | null
          playerid3?: string | null
          playerid30?: string | null
          playerid31?: string | null
          playerid32?: string | null
          playerid33?: string | null
          playerid34?: string | null
          playerid35?: string | null
          playerid36?: string | null
          playerid37?: string | null
          playerid38?: string | null
          playerid39?: string | null
          playerid4?: string | null
          playerid40?: string | null
          playerid41?: string | null
          playerid42?: string | null
          playerid43?: string | null
          playerid44?: string | null
          playerid45?: string | null
          playerid46?: string | null
          playerid47?: string | null
          playerid48?: string | null
          playerid49?: string | null
          playerid5?: string | null
          playerid50?: string | null
          playerid51?: string | null
          playerid6?: string | null
          playerid7?: string | null
          playerid8?: string | null
          playerid9?: string | null
          profileid?: string | null
          rightcornerkicktakerid?: string | null
          rightfreekicktakerid?: string | null
          sourceformationid?: string | null
          teamid?: string | null
          teamsheetid?: string | null
          teamsheetname?: string | null
        }
        Update: {
          artificialkey?: string | null
          captainid?: string | null
          cksupport1?: string | null
          cksupport2?: string | null
          cksupport3?: string | null
          customsub0in?: string | null
          customsub0out?: string | null
          customsub1in?: string | null
          customsub1out?: string | null
          customsub2in?: string | null
          customsub2out?: string | null
          isfavourite?: string | null
          leftcornerkicktakerid?: string | null
          leftfreekicktakerid?: string | null
          longkicktakerid?: string | null
          penaltytakerid?: string | null
          playerid0?: string | null
          playerid1?: string | null
          playerid10?: string | null
          playerid11?: string | null
          playerid12?: string | null
          playerid13?: string | null
          playerid14?: string | null
          playerid15?: string | null
          playerid16?: string | null
          playerid17?: string | null
          playerid18?: string | null
          playerid19?: string | null
          playerid2?: string | null
          playerid20?: string | null
          playerid21?: string | null
          playerid22?: string | null
          playerid23?: string | null
          playerid24?: string | null
          playerid25?: string | null
          playerid26?: string | null
          playerid27?: string | null
          playerid28?: string | null
          playerid29?: string | null
          playerid3?: string | null
          playerid30?: string | null
          playerid31?: string | null
          playerid32?: string | null
          playerid33?: string | null
          playerid34?: string | null
          playerid35?: string | null
          playerid36?: string | null
          playerid37?: string | null
          playerid38?: string | null
          playerid39?: string | null
          playerid4?: string | null
          playerid40?: string | null
          playerid41?: string | null
          playerid42?: string | null
          playerid43?: string | null
          playerid44?: string | null
          playerid45?: string | null
          playerid46?: string | null
          playerid47?: string | null
          playerid48?: string | null
          playerid49?: string | null
          playerid5?: string | null
          playerid50?: string | null
          playerid51?: string | null
          playerid6?: string | null
          playerid7?: string | null
          playerid8?: string | null
          playerid9?: string | null
          profileid?: string | null
          rightcornerkicktakerid?: string | null
          rightfreekicktakerid?: string | null
          sourceformationid?: string | null
          teamid?: string | null
          teamsheetid?: string | null
          teamsheetname?: string | null
        }
        Relationships: []
      }
      crowdregion: {
        Row: {
          crowdregion: string | null
          skintone: number | null
          weight: number | null
        }
        Insert: {
          crowdregion?: string | null
          skintone?: number | null
          weight?: number | null
        }
        Update: {
          crowdregion?: string | null
          skintone?: number | null
          weight?: number | null
        }
        Relationships: []
      }
      crowdregionlrc: {
        Row: {
          cold_drycloth: string | null
          cold_snowcloth: number | null
          cold_wetcloth: number | null
          crowdregion: string | null
          rain_drycloth: number | null
          rain_snowcloth: number | null
          rain_wetcloth: number | null
          skintone_2: number | null
          skintone_4: number | null
          skintone_7: number | null
          skintone_9: number | null
          sunny_drycloth: number | null
          sunny_snowcloth: string | null
          sunny_wetcloth: number | null
        }
        Insert: {
          cold_drycloth?: string | null
          cold_snowcloth?: number | null
          cold_wetcloth?: number | null
          crowdregion?: string | null
          rain_drycloth?: number | null
          rain_snowcloth?: number | null
          rain_wetcloth?: number | null
          skintone_2?: number | null
          skintone_4?: number | null
          skintone_7?: number | null
          skintone_9?: number | null
          sunny_drycloth?: number | null
          sunny_snowcloth?: string | null
          sunny_wetcloth?: number | null
        }
        Update: {
          cold_drycloth?: string | null
          cold_snowcloth?: number | null
          cold_wetcloth?: number | null
          crowdregion?: string | null
          rain_drycloth?: number | null
          rain_snowcloth?: number | null
          rain_wetcloth?: number | null
          skintone_2?: number | null
          skintone_4?: number | null
          skintone_7?: number | null
          skintone_9?: number | null
          sunny_drycloth?: number | null
          sunny_snowcloth?: string | null
          sunny_wetcloth?: number | null
        }
        Relationships: []
      }
      customteamstyles: {
        Row: {
          basestyle: string | null
          busbuildupspeed: string | null
          busdribbling: string | null
          buspassing: string | null
          buspositioning: string | null
          cccrossing: string | null
          ccpassing: string | null
          ccpositioning: string | null
          ccshooting: string | null
          defaggression: string | null
          defdefenderline: string | null
          defmentality: string | null
          defteamwidth: string | null
          teamstyleid: string | null
        }
        Insert: {
          basestyle?: string | null
          busbuildupspeed?: string | null
          busdribbling?: string | null
          buspassing?: string | null
          buspositioning?: string | null
          cccrossing?: string | null
          ccpassing?: string | null
          ccpositioning?: string | null
          ccshooting?: string | null
          defaggression?: string | null
          defdefenderline?: string | null
          defmentality?: string | null
          defteamwidth?: string | null
          teamstyleid?: string | null
        }
        Update: {
          basestyle?: string | null
          busbuildupspeed?: string | null
          busdribbling?: string | null
          buspassing?: string | null
          buspositioning?: string | null
          cccrossing?: string | null
          ccpassing?: string | null
          ccpositioning?: string | null
          ccshooting?: string | null
          defaggression?: string | null
          defdefenderline?: string | null
          defmentality?: string | null
          defteamwidth?: string | null
          teamstyleid?: string | null
        }
        Relationships: []
      }
      dbversion: {
        Row: {
          artificialkey: string | null
          version: number | null
        }
        Insert: {
          artificialkey?: string | null
          version?: number | null
        }
        Update: {
          artificialkey?: string | null
          version?: number | null
        }
        Relationships: []
      }
      dlcballs: {
        Row: {
          assetid: string | null
          name: string | null
        }
        Insert: {
          assetid?: string | null
          name?: string | null
        }
        Update: {
          assetid?: string | null
          name?: string | null
        }
        Relationships: []
      }
      dlcboots: {
        Row: {
          assetid: string | null
          name: string | null
        }
        Insert: {
          assetid?: string | null
          name?: string | null
        }
        Update: {
          assetid?: string | null
          name?: string | null
        }
        Relationships: []
      }
      factory_teams: {
        Row: {
          adboardid: number | null
          assetid: number | null
          attackrating: string | null
          balltype: number | null
          bodytypeid: number | null
          busbuildupspeed: number | null
          buspassing: number | null
          buspositioning: number | null
          captainid: number | null
          cccrossing: number | null
          ccpassing: number | null
          ccpositioning: number | null
          ccshooting: number | null
          defaggression: number | null
          defdefenderline: number | null
          defenserating: string | null
          defmentality: number | null
          defteamwidth: number | null
          domesticprestige: number | null
          ethnicity: number | null
          fancrowdhairskintexturecode: string | null
          form: string | null
          freekicktakerid: number | null
          genericbanner: string | null
          genericint1: number | null
          genericint2: number | null
          internationalprestige: number | null
          jerseytype: number | null
          latitude: number | null
          leftcornerkicktakerid: number | null
          longitude: number | null
          longkicktakerid: number | null
          matchdayattackrating: string | null
          matchdaydefenserating: string | null
          matchdaymidfieldrating: string | null
          matchdayoverallrating: string | null
          midfieldrating: string | null
          numtransfersin: string | null
          overallrating: string | null
          penaltytakerid: number | null
          personalityid: string | null
          powid: number | null
          rightcornerkicktakerid: number | null
          rivalteam: number | null
          stafftracksuitcolorcode: string | null
          suittypeid: number | null
          suitvariationid: number | null
          teamcolor1b: number | null
          teamcolor1g: number | null
          teamcolor1r: number | null
          teamcolor2b: number | null
          teamcolor2g: number | null
          teamcolor2r: number | null
          teamcolor3b: string | null
          teamcolor3g: string | null
          teamcolor3r: string | null
          teamid: number | null
          teamname: string | null
          transferbudget: string | null
          utcoffset: number | null
        }
        Insert: {
          adboardid?: number | null
          assetid?: number | null
          attackrating?: string | null
          balltype?: number | null
          bodytypeid?: number | null
          busbuildupspeed?: number | null
          buspassing?: number | null
          buspositioning?: number | null
          captainid?: number | null
          cccrossing?: number | null
          ccpassing?: number | null
          ccpositioning?: number | null
          ccshooting?: number | null
          defaggression?: number | null
          defdefenderline?: number | null
          defenserating?: string | null
          defmentality?: number | null
          defteamwidth?: number | null
          domesticprestige?: number | null
          ethnicity?: number | null
          fancrowdhairskintexturecode?: string | null
          form?: string | null
          freekicktakerid?: number | null
          genericbanner?: string | null
          genericint1?: number | null
          genericint2?: number | null
          internationalprestige?: number | null
          jerseytype?: number | null
          latitude?: number | null
          leftcornerkicktakerid?: number | null
          longitude?: number | null
          longkicktakerid?: number | null
          matchdayattackrating?: string | null
          matchdaydefenserating?: string | null
          matchdaymidfieldrating?: string | null
          matchdayoverallrating?: string | null
          midfieldrating?: string | null
          numtransfersin?: string | null
          overallrating?: string | null
          penaltytakerid?: number | null
          personalityid?: string | null
          powid?: number | null
          rightcornerkicktakerid?: number | null
          rivalteam?: number | null
          stafftracksuitcolorcode?: string | null
          suittypeid?: number | null
          suitvariationid?: number | null
          teamcolor1b?: number | null
          teamcolor1g?: number | null
          teamcolor1r?: number | null
          teamcolor2b?: number | null
          teamcolor2g?: number | null
          teamcolor2r?: number | null
          teamcolor3b?: string | null
          teamcolor3g?: string | null
          teamcolor3r?: string | null
          teamid?: number | null
          teamname?: string | null
          transferbudget?: string | null
          utcoffset?: number | null
        }
        Update: {
          adboardid?: number | null
          assetid?: number | null
          attackrating?: string | null
          balltype?: number | null
          bodytypeid?: number | null
          busbuildupspeed?: number | null
          buspassing?: number | null
          buspositioning?: number | null
          captainid?: number | null
          cccrossing?: number | null
          ccpassing?: number | null
          ccpositioning?: number | null
          ccshooting?: number | null
          defaggression?: number | null
          defdefenderline?: number | null
          defenserating?: string | null
          defmentality?: number | null
          defteamwidth?: number | null
          domesticprestige?: number | null
          ethnicity?: number | null
          fancrowdhairskintexturecode?: string | null
          form?: string | null
          freekicktakerid?: number | null
          genericbanner?: string | null
          genericint1?: number | null
          genericint2?: number | null
          internationalprestige?: number | null
          jerseytype?: number | null
          latitude?: number | null
          leftcornerkicktakerid?: number | null
          longitude?: number | null
          longkicktakerid?: number | null
          matchdayattackrating?: string | null
          matchdaydefenserating?: string | null
          matchdaymidfieldrating?: string | null
          matchdayoverallrating?: string | null
          midfieldrating?: string | null
          numtransfersin?: string | null
          overallrating?: string | null
          penaltytakerid?: number | null
          personalityid?: string | null
          powid?: number | null
          rightcornerkicktakerid?: number | null
          rivalteam?: number | null
          stafftracksuitcolorcode?: string | null
          suittypeid?: number | null
          suitvariationid?: number | null
          teamcolor1b?: number | null
          teamcolor1g?: number | null
          teamcolor1r?: number | null
          teamcolor2b?: number | null
          teamcolor2g?: number | null
          teamcolor2r?: number | null
          teamcolor3b?: string | null
          teamcolor3g?: string | null
          teamcolor3r?: string | null
          teamid?: number | null
          teamname?: string | null
          transferbudget?: string | null
          utcoffset?: number | null
        }
        Relationships: []
      }
      fifaGameSettings: {
        Row: {
          formationid: number | null
          offset0x: number | null
          offset0y: number | null
          offset10x: number | null
          offset10y: number | null
          offset1x: number | null
          offset1y: number | null
          offset2x: number | null
          offset2y: number | null
          offset3x: number | null
          offset3y: number | null
          offset4x: number | null
          offset4y: number | null
          offset5x: number | null
          offset5y: number | null
          offset6x: number | null
          offset6y: number | null
          offset7x: number | null
          offset7y: number | null
          offset8x: number | null
          offset8y: number | null
          offset9x: number | null
          offset9y: number | null
        }
        Insert: {
          formationid?: number | null
          offset0x?: number | null
          offset0y?: number | null
          offset10x?: number | null
          offset10y?: number | null
          offset1x?: number | null
          offset1y?: number | null
          offset2x?: number | null
          offset2y?: number | null
          offset3x?: number | null
          offset3y?: number | null
          offset4x?: number | null
          offset4y?: number | null
          offset5x?: number | null
          offset5y?: number | null
          offset6x?: number | null
          offset6y?: number | null
          offset7x?: number | null
          offset7y?: number | null
          offset8x?: number | null
          offset8y?: number | null
          offset9x?: number | null
          offset9y?: number | null
        }
        Update: {
          formationid?: number | null
          offset0x?: number | null
          offset0y?: number | null
          offset10x?: number | null
          offset10y?: number | null
          offset1x?: number | null
          offset1y?: number | null
          offset2x?: number | null
          offset2y?: number | null
          offset3x?: number | null
          offset3y?: number | null
          offset4x?: number | null
          offset4y?: number | null
          offset5x?: number | null
          offset5y?: number | null
          offset6x?: number | null
          offset6y?: number | null
          offset7x?: number | null
          offset7y?: number | null
          offset8x?: number | null
          offset8y?: number | null
          offset9x?: number | null
          offset9y?: number | null
        }
        Relationships: []
      }
      formationoffsets: {
        Row: {
          formationid: number | null
          offset0x: number | null
          offset0y: number | null
          offset10x: number | null
          offset10y: number | null
          offset1x: number | null
          offset1y: number | null
          offset2x: number | null
          offset2y: number | null
          offset3x: number | null
          offset3y: number | null
          offset4x: number | null
          offset4y: number | null
          offset5x: number | null
          offset5y: number | null
          offset6x: number | null
          offset6y: number | null
          offset7x: number | null
          offset7y: number | null
          offset8x: number | null
          offset8y: number | null
          offset9x: number | null
          offset9y: number | null
        }
        Insert: {
          formationid?: number | null
          offset0x?: number | null
          offset0y?: number | null
          offset10x?: number | null
          offset10y?: number | null
          offset1x?: number | null
          offset1y?: number | null
          offset2x?: number | null
          offset2y?: number | null
          offset3x?: number | null
          offset3y?: number | null
          offset4x?: number | null
          offset4y?: number | null
          offset5x?: number | null
          offset5y?: number | null
          offset6x?: number | null
          offset6y?: number | null
          offset7x?: number | null
          offset7y?: number | null
          offset8x?: number | null
          offset8y?: number | null
          offset9x?: number | null
          offset9y?: number | null
        }
        Update: {
          formationid?: number | null
          offset0x?: number | null
          offset0y?: number | null
          offset10x?: number | null
          offset10y?: number | null
          offset1x?: number | null
          offset1y?: number | null
          offset2x?: number | null
          offset2y?: number | null
          offset3x?: number | null
          offset3y?: number | null
          offset4x?: number | null
          offset4y?: number | null
          offset5x?: number | null
          offset5y?: number | null
          offset6x?: number | null
          offset6y?: number | null
          offset7x?: number | null
          offset7y?: number | null
          offset8x?: number | null
          offset8y?: number | null
          offset9x?: number | null
          offset9y?: number | null
        }
        Relationships: []
      }
      gp_ucc: {
        Row: {
          animationid: number | null
          playerid: number | null
          probability: number | null
          ucctype: string | null
        }
        Insert: {
          animationid?: number | null
          playerid?: number | null
          probability?: number | null
          ucctype?: string | null
        }
        Update: {
          animationid?: number | null
          playerid?: number | null
          probability?: number | null
          ucctype?: string | null
        }
        Relationships: []
      }
      highres_fat: {
        Row: {
          assetid: number | null
          ca_earAntihelix_NL_IXX_B_F: number | null
          ca_earAntihelix_NL_IXX_D_U: number | null
          ca_earAntihelix_NL_IXX_N_W: number | null
          ca_earAntihelix_NL_SXX_B_F: number | null
          ca_earAntihelix_NL_SXX_D_U: number | null
          ca_earAntihelix_NL_SXX_N_W: number | null
          ca_earAntihelix_NR_IXX_B_F: number | null
          ca_earAntihelix_NR_IXX_D_U: number | null
          ca_earAntihelix_NR_IXX_N_W: number | null
          ca_earAntihelix_NR_SXX_B_F: number | null
          ca_earAntihelix_NR_SXX_D_U: number | null
          ca_earAntihelix_NR_SXX_N_W: number | null
          ca_earHelix_NL_IXX_B_F: number | null
          ca_earHelix_NL_IXX_D_U: number | null
          ca_earHelix_NL_IXX_N_W: number | null
          ca_earHelix_NL_SXA_B_F: string | null
          ca_earHelix_NL_SXA_D_U: number | null
          ca_earHelix_NL_SXA_N_W: number | null
          ca_earHelix_NL_SXP_B_F: number | null
          ca_earHelix_NL_SXP_D_U: number | null
          ca_earHelix_NL_SXP_N_W: number | null
          ca_earHelix_NR_IXX_B_F: number | null
          ca_earHelix_NR_IXX_D_U: number | null
          ca_earHelix_NR_IXX_N_W: number | null
          ca_earHelix_NR_SXA_B_F: string | null
          ca_earHelix_NR_SXA_D_U: number | null
          ca_earHelix_NR_SXA_N_W: number | null
          ca_earHelix_NR_SXP_B_F: number | null
          ca_earHelix_NR_SXP_D_U: number | null
          ca_earHelix_NR_SXP_N_W: number | null
          ca_earlobe_NL_XXX_B_F: number | null
          ca_earlobe_NL_XXX_D_U: number | null
          ca_earlobe_NL_XXX_N_W: number | null
          ca_earlobe_NR_XXX_B_F: number | null
          ca_earlobe_NR_XXX_D_U: number | null
          ca_earlobe_NR_XXX_N_W: number | null
          ca_eartragus_NL_XXX_B_F: string | null
          ca_eartragus_NL_XXX_D_U: number | null
          ca_eartragus_NL_XXX_N_W: number | null
          ca_eartragus_NR_XXX_B_F: number | null
          ca_eartragus_NR_XXX_D_U: string | null
          ca_eartragus_NR_XXX_N_W: number | null
          ca_noseAla_NL_ICX_B_F: number | null
          ca_noseAla_NL_ICX_D_U: number | null
          ca_noseAla_NL_ICX_N_W: number | null
          ca_noseAla_NL_ICX_R_A: number | null
          ca_noseAla_NL_ILX_B_F: number | null
          ca_noseAla_NL_ILX_D_U: number | null
          ca_noseAla_NL_ILX_N_W: number | null
          ca_noseAla_NL_ILX_R_A: number | null
          ca_noseAla_NL_IMX_B_F: number | null
          ca_noseAla_NL_IMX_D_U: number | null
          ca_noseAla_NL_IMX_N_W: number | null
          ca_noseAla_NL_IMX_R_A: number | null
          ca_noseAla_NL_IXX_B_F: string | null
          ca_noseAla_NL_IXX_D_U: number | null
          ca_noseAla_NL_IXX_N_W: number | null
          ca_noseAla_NL_IXX_R_A: number | null
          ca_noseAla_NL_SXX_B_F: number | null
          ca_noseAla_NL_SXX_D_U: string | null
          ca_noseAla_NL_SXX_N_W: number | null
          ca_noseAla_NL_SXX_R_A: number | null
          ca_noseAla_NL_XXA_B_F: number | null
          ca_noseAla_NL_XXA_D_U: number | null
          ca_noseAla_NL_XXA_N_W: number | null
          ca_noseAla_NL_XXA_R_A: number | null
          ca_noseAla_NR_ICX_B_F: number | null
          ca_noseAla_NR_ICX_D_U: number | null
          ca_noseAla_NR_ICX_N_W: number | null
          ca_noseAla_NR_ICX_R_A: number | null
          ca_noseAla_NR_ILX_B_F: number | null
          ca_noseAla_NR_ILX_D_U: number | null
          ca_noseAla_NR_ILX_N_W: number | null
          ca_noseAla_NR_ILX_R_A: number | null
          ca_noseAla_NR_IMX_B_F: number | null
          ca_noseAla_NR_IMX_D_U: number | null
          ca_noseAla_NR_IMX_N_W: number | null
          ca_noseAla_NR_IMX_R_A: number | null
          ca_noseAla_NR_IXX_B_F: number | null
          ca_noseAla_NR_IXX_D_U: number | null
          ca_noseAla_NR_IXX_N_W: number | null
          ca_noseAla_NR_IXX_R_A: number | null
          ca_noseAla_NR_SXX_B_F: number | null
          ca_noseAla_NR_SXX_D_U: number | null
          ca_noseAla_NR_SXX_N_W: number | null
          ca_noseAla_NR_SXX_R_A: number | null
          ca_noseAla_NR_XXA_B_F: number | null
          ca_noseAla_NR_XXA_D_U: number | null
          ca_noseAla_NR_XXA_N_W: number | null
          ca_noseAla_NR_XXA_R_A: number | null
          ca_noseColumella_NN_XXX_B_F: number | null
          ca_noseColumella_NN_XXX_D_U: number | null
          ca_noseColumella_NN_XXX_N_W: number | null
          ca_noseColumella_NN_XXX_R_A: string | null
          ca_noseColumella_NN_XXX_SL_SR: string | null
          ca_noseSupratip_NN_XXX_B_F: number | null
          ca_noseSupratip_NN_XXX_D_U: number | null
          ca_noseSupratip_NN_XXX_N_W: string | null
          ca_noseSupratip_NN_XXX_R_A: number | null
          ca_noseSupratip_NN_XXX_SL_SR: string | null
          ca_noseTip_NN_XXX_B_F: number | null
          ca_noseTip_NN_XXX_D_U: string | null
          ca_noseTip_NN_XXX_N_W: number | null
          ca_noseTip_NN_XXX_R_A: number | null
          ca_noseTip_NN_XXX_SL_SR: number | null
          fa_cheeks_NL_XMX_D_U: number | null
          fa_cheeks_NL_XMX_L_M: number | null
          fa_cheeks_NR_XMX_D_U: number | null
          fa_cheeks_NR_XMX_L_M: number | null
          fa_cheeksMiddle_NL_XXX_D_U: number | null
          fa_cheeksMiddle_NL_XXX_L_M: number | null
          fa_cheeksMiddle_NR_XXX_D_U: number | null
          fa_cheeksMiddle_NR_XXX_L_M: number | null
          fa_earHelix_NL_IXX_L_M: number | null
          fa_earHelix_NL_SXX_L_M: string | null
          fa_earHelix_NR_IXX_L_M: number | null
          fa_earHelix_NR_SXX_L_M: string | null
          fa_forehead_NL_XLX_D_U: number | null
          fa_forehead_NL_XLX_L_M: number | null
          fa_forehead_NN_XMX_D_U: number | null
          fa_forehead_NN_XMX_L_M: number | null
          fa_forehead_NR_XLX_D_U: number | null
          fa_forehead_NR_XLX_L_M: number | null
          fa_jowl_NL_IXX_D_U: string | null
          fa_jowl_NL_IXX_L_M: number | null
          fa_jowl_NL_SXX_D_U: number | null
          fa_jowl_NL_SXX_L_M: number | null
          fa_jowl_NR_IXX_D_U: string | null
          fa_jowl_NR_IXX_L_M: number | null
          fa_jowl_NR_SXX_D_U: number | null
          fa_jowl_NR_SXX_L_M: number | null
          fa_lip_NL_IXX_D_U: number | null
          fa_lip_NL_IXX_L_M: number | null
          fa_lip_NL_SXX_D_U: number | null
          fa_lip_NL_SXX_L_M: number | null
          fa_lip_NR_IXX_D_U: number | null
          fa_lip_NR_IXX_L_M: number | null
          fa_lip_NR_SXX_D_U: number | null
          fa_lip_NR_SXX_L_M: number | null
          fa_mental_NN_IXX_D_U: number | null
          fa_mental_NN_IXX_L_M: number | null
          fa_mental_NN_XXX_D_U: number | null
          fa_mental_NN_XXX_L_M: number | null
          fa_nasolabial_NL_IXX_D_U: number | null
          fa_nasolabial_NL_IXX_L_M: number | null
          fa_nasolabial_NL_SXX_D_U: number | null
          fa_nasolabial_NL_SXX_L_M: number | null
          fa_nasolabial_NR_IXX_D_U: number | null
          fa_nasolabial_NR_IXX_L_M: number | null
          fa_nasolabial_NR_SXX_D_U: number | null
          fa_nasolabial_NR_SXX_L_M: number | null
          fa_neck_NL_XXP_L_M: number | null
          fa_neck_NR_XXP_L_M: number | null
          fa_nose_NN_XXX_L_M: number | null
          fa_orbital_NL_IXX_D_U: number | null
          fa_orbital_NL_IXX_L_M: number | null
          fa_orbital_NL_SXX_D_U: number | null
          fa_orbital_NL_SXX_L_M: number | null
          fa_orbital_NL_XLX_D_U: number | null
          fa_orbital_NL_XLX_L_M: number | null
          fa_orbital_NR_IXX_D_U: number | null
          fa_orbital_NR_IXX_L_M: number | null
          fa_orbital_NR_SXX_D_U: number | null
          fa_orbital_NR_SXX_L_M: number | null
          fa_orbital_NR_XLX_D_U: number | null
          fa_orbital_NR_XLX_L_M: number | null
          fa_periorbital_NL_IXX_D_U: number | null
          fa_periorbital_NL_IXX_L_M: number | null
          fa_periorbital_NR_IXX_D_U: number | null
          fa_periorbital_NR_IXX_L_M: number | null
          fa_preplatysmal_NL_XXX_L_M: number | null
          fa_preplatysmal_NR_XXX_L_M: number | null
          fa_submandibular_NL_XXX_D_U: number | null
          fa_submandibular_NL_XXX_L_M: number | null
          fa_submandibular_NR_XXX_D_U: number | null
          fa_submandibular_NR_XXX_L_M: number | null
          fa_submental_NL_XXX_D_U: number | null
          fa_submental_NL_XXX_L_M: number | null
          fa_submental_NR_XXX_D_U: number | null
          fa_submental_NR_XXX_L_M: number | null
          fa_temporal_NL_XLX_D_U: number | null
          fa_temporal_NL_XLX_L_M: number | null
          fa_temporal_NR_XLX_D_U: number | null
          fa_temporal_NR_XLX_L_M: number | null
        }
        Insert: {
          assetid?: number | null
          ca_earAntihelix_NL_IXX_B_F?: number | null
          ca_earAntihelix_NL_IXX_D_U?: number | null
          ca_earAntihelix_NL_IXX_N_W?: number | null
          ca_earAntihelix_NL_SXX_B_F?: number | null
          ca_earAntihelix_NL_SXX_D_U?: number | null
          ca_earAntihelix_NL_SXX_N_W?: number | null
          ca_earAntihelix_NR_IXX_B_F?: number | null
          ca_earAntihelix_NR_IXX_D_U?: number | null
          ca_earAntihelix_NR_IXX_N_W?: number | null
          ca_earAntihelix_NR_SXX_B_F?: number | null
          ca_earAntihelix_NR_SXX_D_U?: number | null
          ca_earAntihelix_NR_SXX_N_W?: number | null
          ca_earHelix_NL_IXX_B_F?: number | null
          ca_earHelix_NL_IXX_D_U?: number | null
          ca_earHelix_NL_IXX_N_W?: number | null
          ca_earHelix_NL_SXA_B_F?: string | null
          ca_earHelix_NL_SXA_D_U?: number | null
          ca_earHelix_NL_SXA_N_W?: number | null
          ca_earHelix_NL_SXP_B_F?: number | null
          ca_earHelix_NL_SXP_D_U?: number | null
          ca_earHelix_NL_SXP_N_W?: number | null
          ca_earHelix_NR_IXX_B_F?: number | null
          ca_earHelix_NR_IXX_D_U?: number | null
          ca_earHelix_NR_IXX_N_W?: number | null
          ca_earHelix_NR_SXA_B_F?: string | null
          ca_earHelix_NR_SXA_D_U?: number | null
          ca_earHelix_NR_SXA_N_W?: number | null
          ca_earHelix_NR_SXP_B_F?: number | null
          ca_earHelix_NR_SXP_D_U?: number | null
          ca_earHelix_NR_SXP_N_W?: number | null
          ca_earlobe_NL_XXX_B_F?: number | null
          ca_earlobe_NL_XXX_D_U?: number | null
          ca_earlobe_NL_XXX_N_W?: number | null
          ca_earlobe_NR_XXX_B_F?: number | null
          ca_earlobe_NR_XXX_D_U?: number | null
          ca_earlobe_NR_XXX_N_W?: number | null
          ca_eartragus_NL_XXX_B_F?: string | null
          ca_eartragus_NL_XXX_D_U?: number | null
          ca_eartragus_NL_XXX_N_W?: number | null
          ca_eartragus_NR_XXX_B_F?: number | null
          ca_eartragus_NR_XXX_D_U?: string | null
          ca_eartragus_NR_XXX_N_W?: number | null
          ca_noseAla_NL_ICX_B_F?: number | null
          ca_noseAla_NL_ICX_D_U?: number | null
          ca_noseAla_NL_ICX_N_W?: number | null
          ca_noseAla_NL_ICX_R_A?: number | null
          ca_noseAla_NL_ILX_B_F?: number | null
          ca_noseAla_NL_ILX_D_U?: number | null
          ca_noseAla_NL_ILX_N_W?: number | null
          ca_noseAla_NL_ILX_R_A?: number | null
          ca_noseAla_NL_IMX_B_F?: number | null
          ca_noseAla_NL_IMX_D_U?: number | null
          ca_noseAla_NL_IMX_N_W?: number | null
          ca_noseAla_NL_IMX_R_A?: number | null
          ca_noseAla_NL_IXX_B_F?: string | null
          ca_noseAla_NL_IXX_D_U?: number | null
          ca_noseAla_NL_IXX_N_W?: number | null
          ca_noseAla_NL_IXX_R_A?: number | null
          ca_noseAla_NL_SXX_B_F?: number | null
          ca_noseAla_NL_SXX_D_U?: string | null
          ca_noseAla_NL_SXX_N_W?: number | null
          ca_noseAla_NL_SXX_R_A?: number | null
          ca_noseAla_NL_XXA_B_F?: number | null
          ca_noseAla_NL_XXA_D_U?: number | null
          ca_noseAla_NL_XXA_N_W?: number | null
          ca_noseAla_NL_XXA_R_A?: number | null
          ca_noseAla_NR_ICX_B_F?: number | null
          ca_noseAla_NR_ICX_D_U?: number | null
          ca_noseAla_NR_ICX_N_W?: number | null
          ca_noseAla_NR_ICX_R_A?: number | null
          ca_noseAla_NR_ILX_B_F?: number | null
          ca_noseAla_NR_ILX_D_U?: number | null
          ca_noseAla_NR_ILX_N_W?: number | null
          ca_noseAla_NR_ILX_R_A?: number | null
          ca_noseAla_NR_IMX_B_F?: number | null
          ca_noseAla_NR_IMX_D_U?: number | null
          ca_noseAla_NR_IMX_N_W?: number | null
          ca_noseAla_NR_IMX_R_A?: number | null
          ca_noseAla_NR_IXX_B_F?: number | null
          ca_noseAla_NR_IXX_D_U?: number | null
          ca_noseAla_NR_IXX_N_W?: number | null
          ca_noseAla_NR_IXX_R_A?: number | null
          ca_noseAla_NR_SXX_B_F?: number | null
          ca_noseAla_NR_SXX_D_U?: number | null
          ca_noseAla_NR_SXX_N_W?: number | null
          ca_noseAla_NR_SXX_R_A?: number | null
          ca_noseAla_NR_XXA_B_F?: number | null
          ca_noseAla_NR_XXA_D_U?: number | null
          ca_noseAla_NR_XXA_N_W?: number | null
          ca_noseAla_NR_XXA_R_A?: number | null
          ca_noseColumella_NN_XXX_B_F?: number | null
          ca_noseColumella_NN_XXX_D_U?: number | null
          ca_noseColumella_NN_XXX_N_W?: number | null
          ca_noseColumella_NN_XXX_R_A?: string | null
          ca_noseColumella_NN_XXX_SL_SR?: string | null
          ca_noseSupratip_NN_XXX_B_F?: number | null
          ca_noseSupratip_NN_XXX_D_U?: number | null
          ca_noseSupratip_NN_XXX_N_W?: string | null
          ca_noseSupratip_NN_XXX_R_A?: number | null
          ca_noseSupratip_NN_XXX_SL_SR?: string | null
          ca_noseTip_NN_XXX_B_F?: number | null
          ca_noseTip_NN_XXX_D_U?: string | null
          ca_noseTip_NN_XXX_N_W?: number | null
          ca_noseTip_NN_XXX_R_A?: number | null
          ca_noseTip_NN_XXX_SL_SR?: number | null
          fa_cheeks_NL_XMX_D_U?: number | null
          fa_cheeks_NL_XMX_L_M?: number | null
          fa_cheeks_NR_XMX_D_U?: number | null
          fa_cheeks_NR_XMX_L_M?: number | null
          fa_cheeksMiddle_NL_XXX_D_U?: number | null
          fa_cheeksMiddle_NL_XXX_L_M?: number | null
          fa_cheeksMiddle_NR_XXX_D_U?: number | null
          fa_cheeksMiddle_NR_XXX_L_M?: number | null
          fa_earHelix_NL_IXX_L_M?: number | null
          fa_earHelix_NL_SXX_L_M?: string | null
          fa_earHelix_NR_IXX_L_M?: number | null
          fa_earHelix_NR_SXX_L_M?: string | null
          fa_forehead_NL_XLX_D_U?: number | null
          fa_forehead_NL_XLX_L_M?: number | null
          fa_forehead_NN_XMX_D_U?: number | null
          fa_forehead_NN_XMX_L_M?: number | null
          fa_forehead_NR_XLX_D_U?: number | null
          fa_forehead_NR_XLX_L_M?: number | null
          fa_jowl_NL_IXX_D_U?: string | null
          fa_jowl_NL_IXX_L_M?: number | null
          fa_jowl_NL_SXX_D_U?: number | null
          fa_jowl_NL_SXX_L_M?: number | null
          fa_jowl_NR_IXX_D_U?: string | null
          fa_jowl_NR_IXX_L_M?: number | null
          fa_jowl_NR_SXX_D_U?: number | null
          fa_jowl_NR_SXX_L_M?: number | null
          fa_lip_NL_IXX_D_U?: number | null
          fa_lip_NL_IXX_L_M?: number | null
          fa_lip_NL_SXX_D_U?: number | null
          fa_lip_NL_SXX_L_M?: number | null
          fa_lip_NR_IXX_D_U?: number | null
          fa_lip_NR_IXX_L_M?: number | null
          fa_lip_NR_SXX_D_U?: number | null
          fa_lip_NR_SXX_L_M?: number | null
          fa_mental_NN_IXX_D_U?: number | null
          fa_mental_NN_IXX_L_M?: number | null
          fa_mental_NN_XXX_D_U?: number | null
          fa_mental_NN_XXX_L_M?: number | null
          fa_nasolabial_NL_IXX_D_U?: number | null
          fa_nasolabial_NL_IXX_L_M?: number | null
          fa_nasolabial_NL_SXX_D_U?: number | null
          fa_nasolabial_NL_SXX_L_M?: number | null
          fa_nasolabial_NR_IXX_D_U?: number | null
          fa_nasolabial_NR_IXX_L_M?: number | null
          fa_nasolabial_NR_SXX_D_U?: number | null
          fa_nasolabial_NR_SXX_L_M?: number | null
          fa_neck_NL_XXP_L_M?: number | null
          fa_neck_NR_XXP_L_M?: number | null
          fa_nose_NN_XXX_L_M?: number | null
          fa_orbital_NL_IXX_D_U?: number | null
          fa_orbital_NL_IXX_L_M?: number | null
          fa_orbital_NL_SXX_D_U?: number | null
          fa_orbital_NL_SXX_L_M?: number | null
          fa_orbital_NL_XLX_D_U?: number | null
          fa_orbital_NL_XLX_L_M?: number | null
          fa_orbital_NR_IXX_D_U?: number | null
          fa_orbital_NR_IXX_L_M?: number | null
          fa_orbital_NR_SXX_D_U?: number | null
          fa_orbital_NR_SXX_L_M?: number | null
          fa_orbital_NR_XLX_D_U?: number | null
          fa_orbital_NR_XLX_L_M?: number | null
          fa_periorbital_NL_IXX_D_U?: number | null
          fa_periorbital_NL_IXX_L_M?: number | null
          fa_periorbital_NR_IXX_D_U?: number | null
          fa_periorbital_NR_IXX_L_M?: number | null
          fa_preplatysmal_NL_XXX_L_M?: number | null
          fa_preplatysmal_NR_XXX_L_M?: number | null
          fa_submandibular_NL_XXX_D_U?: number | null
          fa_submandibular_NL_XXX_L_M?: number | null
          fa_submandibular_NR_XXX_D_U?: number | null
          fa_submandibular_NR_XXX_L_M?: number | null
          fa_submental_NL_XXX_D_U?: number | null
          fa_submental_NL_XXX_L_M?: number | null
          fa_submental_NR_XXX_D_U?: number | null
          fa_submental_NR_XXX_L_M?: number | null
          fa_temporal_NL_XLX_D_U?: number | null
          fa_temporal_NL_XLX_L_M?: number | null
          fa_temporal_NR_XLX_D_U?: number | null
          fa_temporal_NR_XLX_L_M?: number | null
        }
        Update: {
          assetid?: number | null
          ca_earAntihelix_NL_IXX_B_F?: number | null
          ca_earAntihelix_NL_IXX_D_U?: number | null
          ca_earAntihelix_NL_IXX_N_W?: number | null
          ca_earAntihelix_NL_SXX_B_F?: number | null
          ca_earAntihelix_NL_SXX_D_U?: number | null
          ca_earAntihelix_NL_SXX_N_W?: number | null
          ca_earAntihelix_NR_IXX_B_F?: number | null
          ca_earAntihelix_NR_IXX_D_U?: number | null
          ca_earAntihelix_NR_IXX_N_W?: number | null
          ca_earAntihelix_NR_SXX_B_F?: number | null
          ca_earAntihelix_NR_SXX_D_U?: number | null
          ca_earAntihelix_NR_SXX_N_W?: number | null
          ca_earHelix_NL_IXX_B_F?: number | null
          ca_earHelix_NL_IXX_D_U?: number | null
          ca_earHelix_NL_IXX_N_W?: number | null
          ca_earHelix_NL_SXA_B_F?: string | null
          ca_earHelix_NL_SXA_D_U?: number | null
          ca_earHelix_NL_SXA_N_W?: number | null
          ca_earHelix_NL_SXP_B_F?: number | null
          ca_earHelix_NL_SXP_D_U?: number | null
          ca_earHelix_NL_SXP_N_W?: number | null
          ca_earHelix_NR_IXX_B_F?: number | null
          ca_earHelix_NR_IXX_D_U?: number | null
          ca_earHelix_NR_IXX_N_W?: number | null
          ca_earHelix_NR_SXA_B_F?: string | null
          ca_earHelix_NR_SXA_D_U?: number | null
          ca_earHelix_NR_SXA_N_W?: number | null
          ca_earHelix_NR_SXP_B_F?: number | null
          ca_earHelix_NR_SXP_D_U?: number | null
          ca_earHelix_NR_SXP_N_W?: number | null
          ca_earlobe_NL_XXX_B_F?: number | null
          ca_earlobe_NL_XXX_D_U?: number | null
          ca_earlobe_NL_XXX_N_W?: number | null
          ca_earlobe_NR_XXX_B_F?: number | null
          ca_earlobe_NR_XXX_D_U?: number | null
          ca_earlobe_NR_XXX_N_W?: number | null
          ca_eartragus_NL_XXX_B_F?: string | null
          ca_eartragus_NL_XXX_D_U?: number | null
          ca_eartragus_NL_XXX_N_W?: number | null
          ca_eartragus_NR_XXX_B_F?: number | null
          ca_eartragus_NR_XXX_D_U?: string | null
          ca_eartragus_NR_XXX_N_W?: number | null
          ca_noseAla_NL_ICX_B_F?: number | null
          ca_noseAla_NL_ICX_D_U?: number | null
          ca_noseAla_NL_ICX_N_W?: number | null
          ca_noseAla_NL_ICX_R_A?: number | null
          ca_noseAla_NL_ILX_B_F?: number | null
          ca_noseAla_NL_ILX_D_U?: number | null
          ca_noseAla_NL_ILX_N_W?: number | null
          ca_noseAla_NL_ILX_R_A?: number | null
          ca_noseAla_NL_IMX_B_F?: number | null
          ca_noseAla_NL_IMX_D_U?: number | null
          ca_noseAla_NL_IMX_N_W?: number | null
          ca_noseAla_NL_IMX_R_A?: number | null
          ca_noseAla_NL_IXX_B_F?: string | null
          ca_noseAla_NL_IXX_D_U?: number | null
          ca_noseAla_NL_IXX_N_W?: number | null
          ca_noseAla_NL_IXX_R_A?: number | null
          ca_noseAla_NL_SXX_B_F?: number | null
          ca_noseAla_NL_SXX_D_U?: string | null
          ca_noseAla_NL_SXX_N_W?: number | null
          ca_noseAla_NL_SXX_R_A?: number | null
          ca_noseAla_NL_XXA_B_F?: number | null
          ca_noseAla_NL_XXA_D_U?: number | null
          ca_noseAla_NL_XXA_N_W?: number | null
          ca_noseAla_NL_XXA_R_A?: number | null
          ca_noseAla_NR_ICX_B_F?: number | null
          ca_noseAla_NR_ICX_D_U?: number | null
          ca_noseAla_NR_ICX_N_W?: number | null
          ca_noseAla_NR_ICX_R_A?: number | null
          ca_noseAla_NR_ILX_B_F?: number | null
          ca_noseAla_NR_ILX_D_U?: number | null
          ca_noseAla_NR_ILX_N_W?: number | null
          ca_noseAla_NR_ILX_R_A?: number | null
          ca_noseAla_NR_IMX_B_F?: number | null
          ca_noseAla_NR_IMX_D_U?: number | null
          ca_noseAla_NR_IMX_N_W?: number | null
          ca_noseAla_NR_IMX_R_A?: number | null
          ca_noseAla_NR_IXX_B_F?: number | null
          ca_noseAla_NR_IXX_D_U?: number | null
          ca_noseAla_NR_IXX_N_W?: number | null
          ca_noseAla_NR_IXX_R_A?: number | null
          ca_noseAla_NR_SXX_B_F?: number | null
          ca_noseAla_NR_SXX_D_U?: number | null
          ca_noseAla_NR_SXX_N_W?: number | null
          ca_noseAla_NR_SXX_R_A?: number | null
          ca_noseAla_NR_XXA_B_F?: number | null
          ca_noseAla_NR_XXA_D_U?: number | null
          ca_noseAla_NR_XXA_N_W?: number | null
          ca_noseAla_NR_XXA_R_A?: number | null
          ca_noseColumella_NN_XXX_B_F?: number | null
          ca_noseColumella_NN_XXX_D_U?: number | null
          ca_noseColumella_NN_XXX_N_W?: number | null
          ca_noseColumella_NN_XXX_R_A?: string | null
          ca_noseColumella_NN_XXX_SL_SR?: string | null
          ca_noseSupratip_NN_XXX_B_F?: number | null
          ca_noseSupratip_NN_XXX_D_U?: number | null
          ca_noseSupratip_NN_XXX_N_W?: string | null
          ca_noseSupratip_NN_XXX_R_A?: number | null
          ca_noseSupratip_NN_XXX_SL_SR?: string | null
          ca_noseTip_NN_XXX_B_F?: number | null
          ca_noseTip_NN_XXX_D_U?: string | null
          ca_noseTip_NN_XXX_N_W?: number | null
          ca_noseTip_NN_XXX_R_A?: number | null
          ca_noseTip_NN_XXX_SL_SR?: number | null
          fa_cheeks_NL_XMX_D_U?: number | null
          fa_cheeks_NL_XMX_L_M?: number | null
          fa_cheeks_NR_XMX_D_U?: number | null
          fa_cheeks_NR_XMX_L_M?: number | null
          fa_cheeksMiddle_NL_XXX_D_U?: number | null
          fa_cheeksMiddle_NL_XXX_L_M?: number | null
          fa_cheeksMiddle_NR_XXX_D_U?: number | null
          fa_cheeksMiddle_NR_XXX_L_M?: number | null
          fa_earHelix_NL_IXX_L_M?: number | null
          fa_earHelix_NL_SXX_L_M?: string | null
          fa_earHelix_NR_IXX_L_M?: number | null
          fa_earHelix_NR_SXX_L_M?: string | null
          fa_forehead_NL_XLX_D_U?: number | null
          fa_forehead_NL_XLX_L_M?: number | null
          fa_forehead_NN_XMX_D_U?: number | null
          fa_forehead_NN_XMX_L_M?: number | null
          fa_forehead_NR_XLX_D_U?: number | null
          fa_forehead_NR_XLX_L_M?: number | null
          fa_jowl_NL_IXX_D_U?: string | null
          fa_jowl_NL_IXX_L_M?: number | null
          fa_jowl_NL_SXX_D_U?: number | null
          fa_jowl_NL_SXX_L_M?: number | null
          fa_jowl_NR_IXX_D_U?: string | null
          fa_jowl_NR_IXX_L_M?: number | null
          fa_jowl_NR_SXX_D_U?: number | null
          fa_jowl_NR_SXX_L_M?: number | null
          fa_lip_NL_IXX_D_U?: number | null
          fa_lip_NL_IXX_L_M?: number | null
          fa_lip_NL_SXX_D_U?: number | null
          fa_lip_NL_SXX_L_M?: number | null
          fa_lip_NR_IXX_D_U?: number | null
          fa_lip_NR_IXX_L_M?: number | null
          fa_lip_NR_SXX_D_U?: number | null
          fa_lip_NR_SXX_L_M?: number | null
          fa_mental_NN_IXX_D_U?: number | null
          fa_mental_NN_IXX_L_M?: number | null
          fa_mental_NN_XXX_D_U?: number | null
          fa_mental_NN_XXX_L_M?: number | null
          fa_nasolabial_NL_IXX_D_U?: number | null
          fa_nasolabial_NL_IXX_L_M?: number | null
          fa_nasolabial_NL_SXX_D_U?: number | null
          fa_nasolabial_NL_SXX_L_M?: number | null
          fa_nasolabial_NR_IXX_D_U?: number | null
          fa_nasolabial_NR_IXX_L_M?: number | null
          fa_nasolabial_NR_SXX_D_U?: number | null
          fa_nasolabial_NR_SXX_L_M?: number | null
          fa_neck_NL_XXP_L_M?: number | null
          fa_neck_NR_XXP_L_M?: number | null
          fa_nose_NN_XXX_L_M?: number | null
          fa_orbital_NL_IXX_D_U?: number | null
          fa_orbital_NL_IXX_L_M?: number | null
          fa_orbital_NL_SXX_D_U?: number | null
          fa_orbital_NL_SXX_L_M?: number | null
          fa_orbital_NL_XLX_D_U?: number | null
          fa_orbital_NL_XLX_L_M?: number | null
          fa_orbital_NR_IXX_D_U?: number | null
          fa_orbital_NR_IXX_L_M?: number | null
          fa_orbital_NR_SXX_D_U?: number | null
          fa_orbital_NR_SXX_L_M?: number | null
          fa_orbital_NR_XLX_D_U?: number | null
          fa_orbital_NR_XLX_L_M?: number | null
          fa_periorbital_NL_IXX_D_U?: number | null
          fa_periorbital_NL_IXX_L_M?: number | null
          fa_periorbital_NR_IXX_D_U?: number | null
          fa_periorbital_NR_IXX_L_M?: number | null
          fa_preplatysmal_NL_XXX_L_M?: number | null
          fa_preplatysmal_NR_XXX_L_M?: number | null
          fa_submandibular_NL_XXX_D_U?: number | null
          fa_submandibular_NL_XXX_L_M?: number | null
          fa_submandibular_NR_XXX_D_U?: number | null
          fa_submandibular_NR_XXX_L_M?: number | null
          fa_submental_NL_XXX_D_U?: number | null
          fa_submental_NL_XXX_L_M?: number | null
          fa_submental_NR_XXX_D_U?: number | null
          fa_submental_NR_XXX_L_M?: number | null
          fa_temporal_NL_XLX_D_U?: number | null
          fa_temporal_NL_XLX_L_M?: number | null
          fa_temporal_NR_XLX_D_U?: number | null
          fa_temporal_NR_XLX_L_M?: number | null
        }
        Relationships: []
      }
      highres_flesh: {
        Row: {
          assetid: number | null
          fl_buccalRecess_NL_XXX_D_U: number | null
          fl_buccalRecess_NL_XXX_L_M: number | null
          fl_buccalRecess_NR_XXX_D_U: number | null
          fl_buccalRecess_NR_XXX_L_M: number | null
          fl_buccomandibularGroove_NL_XXX_L: string | null
          fl_buccomandibularGroove_NR_XXX_L: string | null
          fl_chinCleft_NN_XXX_D_U: number | null
          fl_chinCleft_NN_XXX_SL_SR: number | null
          fl_epicanthic_NL_XCX_B_F: number | null
          fl_epicanthic_NL_XCX_D_U: number | null
          fl_epicanthic_NL_XCX_N_W: number | null
          fl_epicanthic_NL_XCX_R_A: number | null
          fl_epicanthic_NL_XLX_B_F: number | null
          fl_epicanthic_NL_XLX_D_U: number | null
          fl_epicanthic_NL_XLX_N_W: string | null
          fl_epicanthic_NL_XLX_R_A: number | null
          fl_epicanthic_NL_XMX_B_F: number | null
          fl_epicanthic_NL_XMX_D_U: string | null
          fl_epicanthic_NL_XMX_N_W: number | null
          fl_epicanthic_NL_XMX_R_A: string | null
          fl_epicanthic_NR_XCX_B_F: number | null
          fl_epicanthic_NR_XCX_D_U: number | null
          fl_epicanthic_NR_XCX_N_W: number | null
          fl_epicanthic_NR_XCX_R_A: number | null
          fl_epicanthic_NR_XLX_B_F: number | null
          fl_epicanthic_NR_XLX_D_U: number | null
          fl_epicanthic_NR_XLX_N_W: string | null
          fl_epicanthic_NR_XLX_R_A: number | null
          fl_epicanthic_NR_XMX_B_F: number | null
          fl_epicanthic_NR_XMX_D_U: number | null
          fl_epicanthic_NR_XMX_N_W: string | null
          fl_epicanthic_NR_XMX_R_A: string | null
          fl_eyelids_NL_ICX_D_U: number | null
          fl_eyelids_NL_ICX_N_W: number | null
          fl_eyelids_NL_ICX_R_A: number | null
          fl_eyelids_NL_ILX_D_U: number | null
          fl_eyelids_NL_ILX_N_W: number | null
          fl_eyelids_NL_ILX_R_A: number | null
          fl_eyelids_NL_IMX_D_U: number | null
          fl_eyelids_NL_IMX_N_W: number | null
          fl_eyelids_NL_IMX_R_A: number | null
          fl_eyelids_NL_SCX_D_U: number | null
          fl_eyelids_NL_SCX_F: string | null
          fl_eyelids_NL_SCX_N_W: number | null
          fl_eyelids_NL_SCX_R_A: number | null
          fl_eyelids_NL_SLX_D_U: number | null
          fl_eyelids_NL_SLX_N_W: string | null
          fl_eyelids_NL_SLX_R_A: number | null
          fl_eyelids_NL_SMX_D_U: number | null
          fl_eyelids_NL_SMX_N_W: number | null
          fl_eyelids_NL_SMX_R_A: string | null
          fl_eyelids_NL_XLX_D_U: number | null
          fl_eyelids_NL_XLX_N_W: number | null
          fl_eyelids_NL_XLX_R_A: number | null
          fl_eyelids_NL_XMX_D_U: number | null
          fl_eyelids_NL_XMX_N_W: number | null
          fl_eyelids_NL_XMX_R_A: number | null
          fl_eyelids_NR_ICX_D_U: number | null
          fl_eyelids_NR_ICX_N_W: number | null
          fl_eyelids_NR_ICX_R_A: string | null
          fl_eyelids_NR_ILX_D_U: number | null
          fl_eyelids_NR_ILX_N_W: number | null
          fl_eyelids_NR_ILX_R_A: string | null
          fl_eyelids_NR_IMX_D_U: number | null
          fl_eyelids_NR_IMX_N_W: number | null
          fl_eyelids_NR_IMX_R_A: number | null
          fl_eyelids_NR_SCX_D_U: number | null
          fl_eyelids_NR_SCX_F: string | null
          fl_eyelids_NR_SCX_N_W: number | null
          fl_eyelids_NR_SCX_R_A: number | null
          fl_eyelids_NR_SLX_D_U: string | null
          fl_eyelids_NR_SLX_N_W: number | null
          fl_eyelids_NR_SLX_R_A: string | null
          fl_eyelids_NR_SMX_D_U: number | null
          fl_eyelids_NR_SMX_N_W: number | null
          fl_eyelids_NR_SMX_R_A: number | null
          fl_eyelids_NR_XLX_D_U: number | null
          fl_eyelids_NR_XLX_N_W: number | null
          fl_eyelids_NR_XLX_R_A: number | null
          fl_eyelids_NR_XMX_D_U: number | null
          fl_eyelids_NR_XMX_N_W: number | null
          fl_eyelids_NR_XMX_R_A: number | null
          fl_lip_NL_XCX_B_F: number | null
          fl_lip_NL_XCX_D_U: number | null
          fl_lip_NL_XCX_N_W: number | null
          fl_lip_NL_XCX_R_A: number | null
          fl_lip_NL_XLX_B_F: string | null
          fl_lip_NL_XLX_D_U: number | null
          fl_lip_NL_XLX_N_W: number | null
          fl_lip_NL_XLX_R_A: number | null
          fl_lip_NN_XMX_B_F: string | null
          fl_lip_NN_XMX_D_U: number | null
          fl_lip_NN_XMX_N_W: number | null
          fl_lip_NN_XMX_R_A: number | null
          fl_lip_NR_XCX_B_F: number | null
          fl_lip_NR_XCX_D_U: string | null
          fl_lip_NR_XCX_N_W: number | null
          fl_lip_NR_XCX_R_A: number | null
          fl_lip_NR_XLX_B_F: string | null
          fl_lip_NR_XLX_D_U: number | null
          fl_lip_NR_XLX_N_W: number | null
          fl_lip_NR_XLX_R_A: number | null
          fl_lipLower_NL_ICX_B_F: number | null
          fl_lipLower_NL_ICX_D_U: number | null
          fl_lipLower_NL_ICX_N_W: string | null
          fl_lipLower_NL_ICX_R_A: number | null
          fl_lipLower_NL_ILX_B_F: number | null
          fl_lipLower_NL_ILX_D_U: number | null
          fl_lipLower_NL_ILX_N_W: number | null
          fl_lipLower_NL_ILX_R_A: string | null
          fl_lipLower_NL_IXX_B_F: number | null
          fl_lipLower_NL_IXX_D_U: number | null
          fl_lipLower_NL_IXX_N_W: number | null
          fl_lipLower_NL_IXX_R_A: number | null
          fl_lipLower_NL_SLX_B_F: number | null
          fl_lipLower_NL_SLX_D_U: number | null
          fl_lipLower_NL_SLX_N_W: string | null
          fl_lipLower_NL_SLX_R_A: number | null
          fl_lipLower_NN_IMX_B_F: number | null
          fl_lipLower_NN_IMX_D_U: number | null
          fl_lipLower_NN_IMX_N_W: string | null
          fl_lipLower_NN_IMX_R_A: number | null
          fl_lipLower_NN_IMX_SL_SR: number | null
          fl_lipLower_NN_SMX_B_F: number | null
          fl_lipLower_NN_SMX_D_U: number | null
          fl_lipLower_NN_SMX_N_W: number | null
          fl_lipLower_NN_SMX_R_A: number | null
          fl_lipLower_NN_SMX_SL_SR: number | null
          fl_lipLower_NR_ICX_B_F: number | null
          fl_lipLower_NR_ICX_D_U: number | null
          fl_lipLower_NR_ICX_N_W: number | null
          fl_lipLower_NR_ICX_R_A: number | null
          fl_lipLower_NR_ILX_B_F: number | null
          fl_lipLower_NR_ILX_D_U: number | null
          fl_lipLower_NR_ILX_N_W: number | null
          fl_lipLower_NR_ILX_R_A: number | null
          fl_lipLower_NR_IXX_B_F: number | null
          fl_lipLower_NR_IXX_D_U: number | null
          fl_lipLower_NR_IXX_N_W: number | null
          fl_lipLower_NR_IXX_R_A: number | null
          fl_lipLower_NR_SLX_B_F: string | null
          fl_lipLower_NR_SLX_D_U: number | null
          fl_lipLower_NR_SLX_N_W: string | null
          fl_lipLower_NR_SLX_R_A: number | null
          fl_lipUpper_NL_ILX_B_F: number | null
          fl_lipUpper_NL_ILX_D_U: number | null
          fl_lipUpper_NL_ILX_N_W: number | null
          fl_lipUpper_NL_ILX_R_A: number | null
          fl_lipUpper_NL_SCX_B_F: number | null
          fl_lipUpper_NL_SCX_D_U: number | null
          fl_lipUpper_NL_SCX_N_W: number | null
          fl_lipUpper_NL_SCX_R_A: number | null
          fl_lipUpper_NL_SLX_B_F: number | null
          fl_lipUpper_NL_SLX_D_U: number | null
          fl_lipUpper_NL_SLX_N_W: number | null
          fl_lipUpper_NL_SLX_R_A: number | null
          fl_lipUpper_NL_SXX_B_F: string | null
          fl_lipUpper_NL_SXX_D_U: number | null
          fl_lipUpper_NL_SXX_N_W: number | null
          fl_lipUpper_NL_SXX_R_A: string | null
          fl_lipUpper_NN_IMX_B_F: number | null
          fl_lipUpper_NN_IMX_D_U: number | null
          fl_lipUpper_NN_IMX_N_W: number | null
          fl_lipUpper_NN_IMX_R_A: number | null
          fl_lipUpper_NN_IMX_SL_SR: number | null
          fl_lipUpper_NN_SMX_B_F: number | null
          fl_lipUpper_NN_SMX_D_U: number | null
          fl_lipUpper_NN_SMX_N_W: number | null
          fl_lipUpper_NN_SMX_R_A: number | null
          fl_lipUpper_NN_SMX_SL_SR: number | null
          fl_lipUpper_NR_ILX_B_F: number | null
          fl_lipUpper_NR_ILX_D_U: number | null
          fl_lipUpper_NR_ILX_N_W: string | null
          fl_lipUpper_NR_ILX_R_A: number | null
          fl_lipUpper_NR_SCX_B_F: number | null
          fl_lipUpper_NR_SCX_D_U: number | null
          fl_lipUpper_NR_SCX_N_W: number | null
          fl_lipUpper_NR_SCX_R_A: number | null
          fl_lipUpper_NR_SLX_B_F: number | null
          fl_lipUpper_NR_SLX_D_U: number | null
          fl_lipUpper_NR_SLX_N_W: number | null
          fl_lipUpper_NR_SLX_R_A: number | null
          fl_lipUpper_NR_SXX_B_F: string | null
          fl_lipUpper_NR_SXX_D_U: number | null
          fl_lipUpper_NR_SXX_N_W: number | null
          fl_lipUpper_NR_SXX_R_A: string | null
          fl_mandibularGroove_NL_XXX_L: string | null
          fl_mandibularGroove_NR_XXX_L: string | null
          fl_nasojugalGroove_NL_XXX_D_U: number | null
          fl_nasojugalGroove_NL_XXX_L_M: number | null
          fl_nasojugalGroove_NR_XXX_D_U: number | null
          fl_nasojugalGroove_NR_XXX_L_M: number | null
          fl_nasolabialGroove_NL_IXX_L: string | null
          fl_nasolabialGroove_NL_SXX_L_M: number | null
          fl_nasolabialGroove_NR_IXX_L: string | null
          fl_nasolabialGroove_NR_SXX_L_M: number | null
          fl_orbitalGroove_NL_IXX_L_M: number | null
          fl_orbitalGroove_NR_IXX_L_M: number | null
          fl_oromentalGroove_NL_XXX_L: string | null
          fl_oromentalGroove_NR_XXX_L: string | null
          fl_philtrum_NN_XXX_B_F: number | null
          fl_philtrum_NN_XXX_D_U: number | null
          fl_philtrum_NN_XXX_N_W: number | null
          fl_philtrum_NN_XXX_R_A: number | null
          fl_philtrum_NN_XXX_SL_SR: string | null
          mu_corrugator_NL_XXX_D_U: number | null
          mu_corrugator_NL_XXX_L_M: number | null
          mu_corrugator_NR_XXX_D_U: number | null
          mu_corrugator_NR_XXX_L_M: string | null
          mu_masseter_NL_XXX_L_M: number | null
          mu_masseter_NR_XXX_L_M: number | null
          mu_platysma_NL_ILX_D: string | null
          mu_platysma_NL_ILX_N_W: number | null
          mu_platysma_NL_SLX_D: string | null
          mu_platysma_NL_SLX_N_W: number | null
          mu_platysma_NN_IMX_D: string | null
          mu_platysma_NN_SMX_D_U: number | null
          mu_platysma_NN_SMX_N_W: string | null
          mu_platysma_NR_ILX_D: string | null
          mu_platysma_NR_ILX_N_W: number | null
          mu_platysma_NR_SLX_D: string | null
          mu_platysma_NR_SLX_N_W: number | null
          mu_procerus_NN_XXX_D_U: number | null
          mu_procerus_NN_XXX_L_M: number | null
          mu_sternomastoid_NL_XXX_L_M: string | null
          mu_sternomastoid_NL_XXX_R_A: number | null
          mu_sternomastoid_NR_XXX_L_M: string | null
          mu_sternomastoid_NR_XXX_R_A: number | null
          mu_temporalis_NL_XXX_L_M: number | null
          mu_temporalis_NR_XXX_L_M: number | null
          mu_trapezius_NN_SXX_D_U: number | null
          mu_trapezius_NN_SXX_L_M: number | null
        }
        Insert: {
          assetid?: number | null
          fl_buccalRecess_NL_XXX_D_U?: number | null
          fl_buccalRecess_NL_XXX_L_M?: number | null
          fl_buccalRecess_NR_XXX_D_U?: number | null
          fl_buccalRecess_NR_XXX_L_M?: number | null
          fl_buccomandibularGroove_NL_XXX_L?: string | null
          fl_buccomandibularGroove_NR_XXX_L?: string | null
          fl_chinCleft_NN_XXX_D_U?: number | null
          fl_chinCleft_NN_XXX_SL_SR?: number | null
          fl_epicanthic_NL_XCX_B_F?: number | null
          fl_epicanthic_NL_XCX_D_U?: number | null
          fl_epicanthic_NL_XCX_N_W?: number | null
          fl_epicanthic_NL_XCX_R_A?: number | null
          fl_epicanthic_NL_XLX_B_F?: number | null
          fl_epicanthic_NL_XLX_D_U?: number | null
          fl_epicanthic_NL_XLX_N_W?: string | null
          fl_epicanthic_NL_XLX_R_A?: number | null
          fl_epicanthic_NL_XMX_B_F?: number | null
          fl_epicanthic_NL_XMX_D_U?: string | null
          fl_epicanthic_NL_XMX_N_W?: number | null
          fl_epicanthic_NL_XMX_R_A?: string | null
          fl_epicanthic_NR_XCX_B_F?: number | null
          fl_epicanthic_NR_XCX_D_U?: number | null
          fl_epicanthic_NR_XCX_N_W?: number | null
          fl_epicanthic_NR_XCX_R_A?: number | null
          fl_epicanthic_NR_XLX_B_F?: number | null
          fl_epicanthic_NR_XLX_D_U?: number | null
          fl_epicanthic_NR_XLX_N_W?: string | null
          fl_epicanthic_NR_XLX_R_A?: number | null
          fl_epicanthic_NR_XMX_B_F?: number | null
          fl_epicanthic_NR_XMX_D_U?: number | null
          fl_epicanthic_NR_XMX_N_W?: string | null
          fl_epicanthic_NR_XMX_R_A?: string | null
          fl_eyelids_NL_ICX_D_U?: number | null
          fl_eyelids_NL_ICX_N_W?: number | null
          fl_eyelids_NL_ICX_R_A?: number | null
          fl_eyelids_NL_ILX_D_U?: number | null
          fl_eyelids_NL_ILX_N_W?: number | null
          fl_eyelids_NL_ILX_R_A?: number | null
          fl_eyelids_NL_IMX_D_U?: number | null
          fl_eyelids_NL_IMX_N_W?: number | null
          fl_eyelids_NL_IMX_R_A?: number | null
          fl_eyelids_NL_SCX_D_U?: number | null
          fl_eyelids_NL_SCX_F?: string | null
          fl_eyelids_NL_SCX_N_W?: number | null
          fl_eyelids_NL_SCX_R_A?: number | null
          fl_eyelids_NL_SLX_D_U?: number | null
          fl_eyelids_NL_SLX_N_W?: string | null
          fl_eyelids_NL_SLX_R_A?: number | null
          fl_eyelids_NL_SMX_D_U?: number | null
          fl_eyelids_NL_SMX_N_W?: number | null
          fl_eyelids_NL_SMX_R_A?: string | null
          fl_eyelids_NL_XLX_D_U?: number | null
          fl_eyelids_NL_XLX_N_W?: number | null
          fl_eyelids_NL_XLX_R_A?: number | null
          fl_eyelids_NL_XMX_D_U?: number | null
          fl_eyelids_NL_XMX_N_W?: number | null
          fl_eyelids_NL_XMX_R_A?: number | null
          fl_eyelids_NR_ICX_D_U?: number | null
          fl_eyelids_NR_ICX_N_W?: number | null
          fl_eyelids_NR_ICX_R_A?: string | null
          fl_eyelids_NR_ILX_D_U?: number | null
          fl_eyelids_NR_ILX_N_W?: number | null
          fl_eyelids_NR_ILX_R_A?: string | null
          fl_eyelids_NR_IMX_D_U?: number | null
          fl_eyelids_NR_IMX_N_W?: number | null
          fl_eyelids_NR_IMX_R_A?: number | null
          fl_eyelids_NR_SCX_D_U?: number | null
          fl_eyelids_NR_SCX_F?: string | null
          fl_eyelids_NR_SCX_N_W?: number | null
          fl_eyelids_NR_SCX_R_A?: number | null
          fl_eyelids_NR_SLX_D_U?: string | null
          fl_eyelids_NR_SLX_N_W?: number | null
          fl_eyelids_NR_SLX_R_A?: string | null
          fl_eyelids_NR_SMX_D_U?: number | null
          fl_eyelids_NR_SMX_N_W?: number | null
          fl_eyelids_NR_SMX_R_A?: number | null
          fl_eyelids_NR_XLX_D_U?: number | null
          fl_eyelids_NR_XLX_N_W?: number | null
          fl_eyelids_NR_XLX_R_A?: number | null
          fl_eyelids_NR_XMX_D_U?: number | null
          fl_eyelids_NR_XMX_N_W?: number | null
          fl_eyelids_NR_XMX_R_A?: number | null
          fl_lip_NL_XCX_B_F?: number | null
          fl_lip_NL_XCX_D_U?: number | null
          fl_lip_NL_XCX_N_W?: number | null
          fl_lip_NL_XCX_R_A?: number | null
          fl_lip_NL_XLX_B_F?: string | null
          fl_lip_NL_XLX_D_U?: number | null
          fl_lip_NL_XLX_N_W?: number | null
          fl_lip_NL_XLX_R_A?: number | null
          fl_lip_NN_XMX_B_F?: string | null
          fl_lip_NN_XMX_D_U?: number | null
          fl_lip_NN_XMX_N_W?: number | null
          fl_lip_NN_XMX_R_A?: number | null
          fl_lip_NR_XCX_B_F?: number | null
          fl_lip_NR_XCX_D_U?: string | null
          fl_lip_NR_XCX_N_W?: number | null
          fl_lip_NR_XCX_R_A?: number | null
          fl_lip_NR_XLX_B_F?: string | null
          fl_lip_NR_XLX_D_U?: number | null
          fl_lip_NR_XLX_N_W?: number | null
          fl_lip_NR_XLX_R_A?: number | null
          fl_lipLower_NL_ICX_B_F?: number | null
          fl_lipLower_NL_ICX_D_U?: number | null
          fl_lipLower_NL_ICX_N_W?: string | null
          fl_lipLower_NL_ICX_R_A?: number | null
          fl_lipLower_NL_ILX_B_F?: number | null
          fl_lipLower_NL_ILX_D_U?: number | null
          fl_lipLower_NL_ILX_N_W?: number | null
          fl_lipLower_NL_ILX_R_A?: string | null
          fl_lipLower_NL_IXX_B_F?: number | null
          fl_lipLower_NL_IXX_D_U?: number | null
          fl_lipLower_NL_IXX_N_W?: number | null
          fl_lipLower_NL_IXX_R_A?: number | null
          fl_lipLower_NL_SLX_B_F?: number | null
          fl_lipLower_NL_SLX_D_U?: number | null
          fl_lipLower_NL_SLX_N_W?: string | null
          fl_lipLower_NL_SLX_R_A?: number | null
          fl_lipLower_NN_IMX_B_F?: number | null
          fl_lipLower_NN_IMX_D_U?: number | null
          fl_lipLower_NN_IMX_N_W?: string | null
          fl_lipLower_NN_IMX_R_A?: number | null
          fl_lipLower_NN_IMX_SL_SR?: number | null
          fl_lipLower_NN_SMX_B_F?: number | null
          fl_lipLower_NN_SMX_D_U?: number | null
          fl_lipLower_NN_SMX_N_W?: number | null
          fl_lipLower_NN_SMX_R_A?: number | null
          fl_lipLower_NN_SMX_SL_SR?: number | null
          fl_lipLower_NR_ICX_B_F?: number | null
          fl_lipLower_NR_ICX_D_U?: number | null
          fl_lipLower_NR_ICX_N_W?: number | null
          fl_lipLower_NR_ICX_R_A?: number | null
          fl_lipLower_NR_ILX_B_F?: number | null
          fl_lipLower_NR_ILX_D_U?: number | null
          fl_lipLower_NR_ILX_N_W?: number | null
          fl_lipLower_NR_ILX_R_A?: number | null
          fl_lipLower_NR_IXX_B_F?: number | null
          fl_lipLower_NR_IXX_D_U?: number | null
          fl_lipLower_NR_IXX_N_W?: number | null
          fl_lipLower_NR_IXX_R_A?: number | null
          fl_lipLower_NR_SLX_B_F?: string | null
          fl_lipLower_NR_SLX_D_U?: number | null
          fl_lipLower_NR_SLX_N_W?: string | null
          fl_lipLower_NR_SLX_R_A?: number | null
          fl_lipUpper_NL_ILX_B_F?: number | null
          fl_lipUpper_NL_ILX_D_U?: number | null
          fl_lipUpper_NL_ILX_N_W?: number | null
          fl_lipUpper_NL_ILX_R_A?: number | null
          fl_lipUpper_NL_SCX_B_F?: number | null
          fl_lipUpper_NL_SCX_D_U?: number | null
          fl_lipUpper_NL_SCX_N_W?: number | null
          fl_lipUpper_NL_SCX_R_A?: number | null
          fl_lipUpper_NL_SLX_B_F?: number | null
          fl_lipUpper_NL_SLX_D_U?: number | null
          fl_lipUpper_NL_SLX_N_W?: number | null
          fl_lipUpper_NL_SLX_R_A?: number | null
          fl_lipUpper_NL_SXX_B_F?: string | null
          fl_lipUpper_NL_SXX_D_U?: number | null
          fl_lipUpper_NL_SXX_N_W?: number | null
          fl_lipUpper_NL_SXX_R_A?: string | null
          fl_lipUpper_NN_IMX_B_F?: number | null
          fl_lipUpper_NN_IMX_D_U?: number | null
          fl_lipUpper_NN_IMX_N_W?: number | null
          fl_lipUpper_NN_IMX_R_A?: number | null
          fl_lipUpper_NN_IMX_SL_SR?: number | null
          fl_lipUpper_NN_SMX_B_F?: number | null
          fl_lipUpper_NN_SMX_D_U?: number | null
          fl_lipUpper_NN_SMX_N_W?: number | null
          fl_lipUpper_NN_SMX_R_A?: number | null
          fl_lipUpper_NN_SMX_SL_SR?: number | null
          fl_lipUpper_NR_ILX_B_F?: number | null
          fl_lipUpper_NR_ILX_D_U?: number | null
          fl_lipUpper_NR_ILX_N_W?: string | null
          fl_lipUpper_NR_ILX_R_A?: number | null
          fl_lipUpper_NR_SCX_B_F?: number | null
          fl_lipUpper_NR_SCX_D_U?: number | null
          fl_lipUpper_NR_SCX_N_W?: number | null
          fl_lipUpper_NR_SCX_R_A?: number | null
          fl_lipUpper_NR_SLX_B_F?: number | null
          fl_lipUpper_NR_SLX_D_U?: number | null
          fl_lipUpper_NR_SLX_N_W?: number | null
          fl_lipUpper_NR_SLX_R_A?: number | null
          fl_lipUpper_NR_SXX_B_F?: string | null
          fl_lipUpper_NR_SXX_D_U?: number | null
          fl_lipUpper_NR_SXX_N_W?: number | null
          fl_lipUpper_NR_SXX_R_A?: string | null
          fl_mandibularGroove_NL_XXX_L?: string | null
          fl_mandibularGroove_NR_XXX_L?: string | null
          fl_nasojugalGroove_NL_XXX_D_U?: number | null
          fl_nasojugalGroove_NL_XXX_L_M?: number | null
          fl_nasojugalGroove_NR_XXX_D_U?: number | null
          fl_nasojugalGroove_NR_XXX_L_M?: number | null
          fl_nasolabialGroove_NL_IXX_L?: string | null
          fl_nasolabialGroove_NL_SXX_L_M?: number | null
          fl_nasolabialGroove_NR_IXX_L?: string | null
          fl_nasolabialGroove_NR_SXX_L_M?: number | null
          fl_orbitalGroove_NL_IXX_L_M?: number | null
          fl_orbitalGroove_NR_IXX_L_M?: number | null
          fl_oromentalGroove_NL_XXX_L?: string | null
          fl_oromentalGroove_NR_XXX_L?: string | null
          fl_philtrum_NN_XXX_B_F?: number | null
          fl_philtrum_NN_XXX_D_U?: number | null
          fl_philtrum_NN_XXX_N_W?: number | null
          fl_philtrum_NN_XXX_R_A?: number | null
          fl_philtrum_NN_XXX_SL_SR?: string | null
          mu_corrugator_NL_XXX_D_U?: number | null
          mu_corrugator_NL_XXX_L_M?: number | null
          mu_corrugator_NR_XXX_D_U?: number | null
          mu_corrugator_NR_XXX_L_M?: string | null
          mu_masseter_NL_XXX_L_M?: number | null
          mu_masseter_NR_XXX_L_M?: number | null
          mu_platysma_NL_ILX_D?: string | null
          mu_platysma_NL_ILX_N_W?: number | null
          mu_platysma_NL_SLX_D?: string | null
          mu_platysma_NL_SLX_N_W?: number | null
          mu_platysma_NN_IMX_D?: string | null
          mu_platysma_NN_SMX_D_U?: number | null
          mu_platysma_NN_SMX_N_W?: string | null
          mu_platysma_NR_ILX_D?: string | null
          mu_platysma_NR_ILX_N_W?: number | null
          mu_platysma_NR_SLX_D?: string | null
          mu_platysma_NR_SLX_N_W?: number | null
          mu_procerus_NN_XXX_D_U?: number | null
          mu_procerus_NN_XXX_L_M?: number | null
          mu_sternomastoid_NL_XXX_L_M?: string | null
          mu_sternomastoid_NL_XXX_R_A?: number | null
          mu_sternomastoid_NR_XXX_L_M?: string | null
          mu_sternomastoid_NR_XXX_R_A?: number | null
          mu_temporalis_NL_XXX_L_M?: number | null
          mu_temporalis_NR_XXX_L_M?: number | null
          mu_trapezius_NN_SXX_D_U?: number | null
          mu_trapezius_NN_SXX_L_M?: number | null
        }
        Update: {
          assetid?: number | null
          fl_buccalRecess_NL_XXX_D_U?: number | null
          fl_buccalRecess_NL_XXX_L_M?: number | null
          fl_buccalRecess_NR_XXX_D_U?: number | null
          fl_buccalRecess_NR_XXX_L_M?: number | null
          fl_buccomandibularGroove_NL_XXX_L?: string | null
          fl_buccomandibularGroove_NR_XXX_L?: string | null
          fl_chinCleft_NN_XXX_D_U?: number | null
          fl_chinCleft_NN_XXX_SL_SR?: number | null
          fl_epicanthic_NL_XCX_B_F?: number | null
          fl_epicanthic_NL_XCX_D_U?: number | null
          fl_epicanthic_NL_XCX_N_W?: number | null
          fl_epicanthic_NL_XCX_R_A?: number | null
          fl_epicanthic_NL_XLX_B_F?: number | null
          fl_epicanthic_NL_XLX_D_U?: number | null
          fl_epicanthic_NL_XLX_N_W?: string | null
          fl_epicanthic_NL_XLX_R_A?: number | null
          fl_epicanthic_NL_XMX_B_F?: number | null
          fl_epicanthic_NL_XMX_D_U?: string | null
          fl_epicanthic_NL_XMX_N_W?: number | null
          fl_epicanthic_NL_XMX_R_A?: string | null
          fl_epicanthic_NR_XCX_B_F?: number | null
          fl_epicanthic_NR_XCX_D_U?: number | null
          fl_epicanthic_NR_XCX_N_W?: number | null
          fl_epicanthic_NR_XCX_R_A?: number | null
          fl_epicanthic_NR_XLX_B_F?: number | null
          fl_epicanthic_NR_XLX_D_U?: number | null
          fl_epicanthic_NR_XLX_N_W?: string | null
          fl_epicanthic_NR_XLX_R_A?: number | null
          fl_epicanthic_NR_XMX_B_F?: number | null
          fl_epicanthic_NR_XMX_D_U?: number | null
          fl_epicanthic_NR_XMX_N_W?: string | null
          fl_epicanthic_NR_XMX_R_A?: string | null
          fl_eyelids_NL_ICX_D_U?: number | null
          fl_eyelids_NL_ICX_N_W?: number | null
          fl_eyelids_NL_ICX_R_A?: number | null
          fl_eyelids_NL_ILX_D_U?: number | null
          fl_eyelids_NL_ILX_N_W?: number | null
          fl_eyelids_NL_ILX_R_A?: number | null
          fl_eyelids_NL_IMX_D_U?: number | null
          fl_eyelids_NL_IMX_N_W?: number | null
          fl_eyelids_NL_IMX_R_A?: number | null
          fl_eyelids_NL_SCX_D_U?: number | null
          fl_eyelids_NL_SCX_F?: string | null
          fl_eyelids_NL_SCX_N_W?: number | null
          fl_eyelids_NL_SCX_R_A?: number | null
          fl_eyelids_NL_SLX_D_U?: number | null
          fl_eyelids_NL_SLX_N_W?: string | null
          fl_eyelids_NL_SLX_R_A?: number | null
          fl_eyelids_NL_SMX_D_U?: number | null
          fl_eyelids_NL_SMX_N_W?: number | null
          fl_eyelids_NL_SMX_R_A?: string | null
          fl_eyelids_NL_XLX_D_U?: number | null
          fl_eyelids_NL_XLX_N_W?: number | null
          fl_eyelids_NL_XLX_R_A?: number | null
          fl_eyelids_NL_XMX_D_U?: number | null
          fl_eyelids_NL_XMX_N_W?: number | null
          fl_eyelids_NL_XMX_R_A?: number | null
          fl_eyelids_NR_ICX_D_U?: number | null
          fl_eyelids_NR_ICX_N_W?: number | null
          fl_eyelids_NR_ICX_R_A?: string | null
          fl_eyelids_NR_ILX_D_U?: number | null
          fl_eyelids_NR_ILX_N_W?: number | null
          fl_eyelids_NR_ILX_R_A?: string | null
          fl_eyelids_NR_IMX_D_U?: number | null
          fl_eyelids_NR_IMX_N_W?: number | null
          fl_eyelids_NR_IMX_R_A?: number | null
          fl_eyelids_NR_SCX_D_U?: number | null
          fl_eyelids_NR_SCX_F?: string | null
          fl_eyelids_NR_SCX_N_W?: number | null
          fl_eyelids_NR_SCX_R_A?: number | null
          fl_eyelids_NR_SLX_D_U?: string | null
          fl_eyelids_NR_SLX_N_W?: number | null
          fl_eyelids_NR_SLX_R_A?: string | null
          fl_eyelids_NR_SMX_D_U?: number | null
          fl_eyelids_NR_SMX_N_W?: number | null
          fl_eyelids_NR_SMX_R_A?: number | null
          fl_eyelids_NR_XLX_D_U?: number | null
          fl_eyelids_NR_XLX_N_W?: number | null
          fl_eyelids_NR_XLX_R_A?: number | null
          fl_eyelids_NR_XMX_D_U?: number | null
          fl_eyelids_NR_XMX_N_W?: number | null
          fl_eyelids_NR_XMX_R_A?: number | null
          fl_lip_NL_XCX_B_F?: number | null
          fl_lip_NL_XCX_D_U?: number | null
          fl_lip_NL_XCX_N_W?: number | null
          fl_lip_NL_XCX_R_A?: number | null
          fl_lip_NL_XLX_B_F?: string | null
          fl_lip_NL_XLX_D_U?: number | null
          fl_lip_NL_XLX_N_W?: number | null
          fl_lip_NL_XLX_R_A?: number | null
          fl_lip_NN_XMX_B_F?: string | null
          fl_lip_NN_XMX_D_U?: number | null
          fl_lip_NN_XMX_N_W?: number | null
          fl_lip_NN_XMX_R_A?: number | null
          fl_lip_NR_XCX_B_F?: number | null
          fl_lip_NR_XCX_D_U?: string | null
          fl_lip_NR_XCX_N_W?: number | null
          fl_lip_NR_XCX_R_A?: number | null
          fl_lip_NR_XLX_B_F?: string | null
          fl_lip_NR_XLX_D_U?: number | null
          fl_lip_NR_XLX_N_W?: number | null
          fl_lip_NR_XLX_R_A?: number | null
          fl_lipLower_NL_ICX_B_F?: number | null
          fl_lipLower_NL_ICX_D_U?: number | null
          fl_lipLower_NL_ICX_N_W?: string | null
          fl_lipLower_NL_ICX_R_A?: number | null
          fl_lipLower_NL_ILX_B_F?: number | null
          fl_lipLower_NL_ILX_D_U?: number | null
          fl_lipLower_NL_ILX_N_W?: number | null
          fl_lipLower_NL_ILX_R_A?: string | null
          fl_lipLower_NL_IXX_B_F?: number | null
          fl_lipLower_NL_IXX_D_U?: number | null
          fl_lipLower_NL_IXX_N_W?: number | null
          fl_lipLower_NL_IXX_R_A?: number | null
          fl_lipLower_NL_SLX_B_F?: number | null
          fl_lipLower_NL_SLX_D_U?: number | null
          fl_lipLower_NL_SLX_N_W?: string | null
          fl_lipLower_NL_SLX_R_A?: number | null
          fl_lipLower_NN_IMX_B_F?: number | null
          fl_lipLower_NN_IMX_D_U?: number | null
          fl_lipLower_NN_IMX_N_W?: string | null
          fl_lipLower_NN_IMX_R_A?: number | null
          fl_lipLower_NN_IMX_SL_SR?: number | null
          fl_lipLower_NN_SMX_B_F?: number | null
          fl_lipLower_NN_SMX_D_U?: number | null
          fl_lipLower_NN_SMX_N_W?: number | null
          fl_lipLower_NN_SMX_R_A?: number | null
          fl_lipLower_NN_SMX_SL_SR?: number | null
          fl_lipLower_NR_ICX_B_F?: number | null
          fl_lipLower_NR_ICX_D_U?: number | null
          fl_lipLower_NR_ICX_N_W?: number | null
          fl_lipLower_NR_ICX_R_A?: number | null
          fl_lipLower_NR_ILX_B_F?: number | null
          fl_lipLower_NR_ILX_D_U?: number | null
          fl_lipLower_NR_ILX_N_W?: number | null
          fl_lipLower_NR_ILX_R_A?: number | null
          fl_lipLower_NR_IXX_B_F?: number | null
          fl_lipLower_NR_IXX_D_U?: number | null
          fl_lipLower_NR_IXX_N_W?: number | null
          fl_lipLower_NR_IXX_R_A?: number | null
          fl_lipLower_NR_SLX_B_F?: string | null
          fl_lipLower_NR_SLX_D_U?: number | null
          fl_lipLower_NR_SLX_N_W?: string | null
          fl_lipLower_NR_SLX_R_A?: number | null
          fl_lipUpper_NL_ILX_B_F?: number | null
          fl_lipUpper_NL_ILX_D_U?: number | null
          fl_lipUpper_NL_ILX_N_W?: number | null
          fl_lipUpper_NL_ILX_R_A?: number | null
          fl_lipUpper_NL_SCX_B_F?: number | null
          fl_lipUpper_NL_SCX_D_U?: number | null
          fl_lipUpper_NL_SCX_N_W?: number | null
          fl_lipUpper_NL_SCX_R_A?: number | null
          fl_lipUpper_NL_SLX_B_F?: number | null
          fl_lipUpper_NL_SLX_D_U?: number | null
          fl_lipUpper_NL_SLX_N_W?: number | null
          fl_lipUpper_NL_SLX_R_A?: number | null
          fl_lipUpper_NL_SXX_B_F?: string | null
          fl_lipUpper_NL_SXX_D_U?: number | null
          fl_lipUpper_NL_SXX_N_W?: number | null
          fl_lipUpper_NL_SXX_R_A?: string | null
          fl_lipUpper_NN_IMX_B_F?: number | null
          fl_lipUpper_NN_IMX_D_U?: number | null
          fl_lipUpper_NN_IMX_N_W?: number | null
          fl_lipUpper_NN_IMX_R_A?: number | null
          fl_lipUpper_NN_IMX_SL_SR?: number | null
          fl_lipUpper_NN_SMX_B_F?: number | null
          fl_lipUpper_NN_SMX_D_U?: number | null
          fl_lipUpper_NN_SMX_N_W?: number | null
          fl_lipUpper_NN_SMX_R_A?: number | null
          fl_lipUpper_NN_SMX_SL_SR?: number | null
          fl_lipUpper_NR_ILX_B_F?: number | null
          fl_lipUpper_NR_ILX_D_U?: number | null
          fl_lipUpper_NR_ILX_N_W?: string | null
          fl_lipUpper_NR_ILX_R_A?: number | null
          fl_lipUpper_NR_SCX_B_F?: number | null
          fl_lipUpper_NR_SCX_D_U?: number | null
          fl_lipUpper_NR_SCX_N_W?: number | null
          fl_lipUpper_NR_SCX_R_A?: number | null
          fl_lipUpper_NR_SLX_B_F?: number | null
          fl_lipUpper_NR_SLX_D_U?: number | null
          fl_lipUpper_NR_SLX_N_W?: number | null
          fl_lipUpper_NR_SLX_R_A?: number | null
          fl_lipUpper_NR_SXX_B_F?: string | null
          fl_lipUpper_NR_SXX_D_U?: number | null
          fl_lipUpper_NR_SXX_N_W?: number | null
          fl_lipUpper_NR_SXX_R_A?: string | null
          fl_mandibularGroove_NL_XXX_L?: string | null
          fl_mandibularGroove_NR_XXX_L?: string | null
          fl_nasojugalGroove_NL_XXX_D_U?: number | null
          fl_nasojugalGroove_NL_XXX_L_M?: number | null
          fl_nasojugalGroove_NR_XXX_D_U?: number | null
          fl_nasojugalGroove_NR_XXX_L_M?: number | null
          fl_nasolabialGroove_NL_IXX_L?: string | null
          fl_nasolabialGroove_NL_SXX_L_M?: number | null
          fl_nasolabialGroove_NR_IXX_L?: string | null
          fl_nasolabialGroove_NR_SXX_L_M?: number | null
          fl_orbitalGroove_NL_IXX_L_M?: number | null
          fl_orbitalGroove_NR_IXX_L_M?: number | null
          fl_oromentalGroove_NL_XXX_L?: string | null
          fl_oromentalGroove_NR_XXX_L?: string | null
          fl_philtrum_NN_XXX_B_F?: number | null
          fl_philtrum_NN_XXX_D_U?: number | null
          fl_philtrum_NN_XXX_N_W?: number | null
          fl_philtrum_NN_XXX_R_A?: number | null
          fl_philtrum_NN_XXX_SL_SR?: string | null
          mu_corrugator_NL_XXX_D_U?: number | null
          mu_corrugator_NL_XXX_L_M?: number | null
          mu_corrugator_NR_XXX_D_U?: number | null
          mu_corrugator_NR_XXX_L_M?: string | null
          mu_masseter_NL_XXX_L_M?: number | null
          mu_masseter_NR_XXX_L_M?: number | null
          mu_platysma_NL_ILX_D?: string | null
          mu_platysma_NL_ILX_N_W?: number | null
          mu_platysma_NL_SLX_D?: string | null
          mu_platysma_NL_SLX_N_W?: number | null
          mu_platysma_NN_IMX_D?: string | null
          mu_platysma_NN_SMX_D_U?: number | null
          mu_platysma_NN_SMX_N_W?: string | null
          mu_platysma_NR_ILX_D?: string | null
          mu_platysma_NR_ILX_N_W?: number | null
          mu_platysma_NR_SLX_D?: string | null
          mu_platysma_NR_SLX_N_W?: number | null
          mu_procerus_NN_XXX_D_U?: number | null
          mu_procerus_NN_XXX_L_M?: number | null
          mu_sternomastoid_NL_XXX_L_M?: string | null
          mu_sternomastoid_NL_XXX_R_A?: number | null
          mu_sternomastoid_NR_XXX_L_M?: string | null
          mu_sternomastoid_NR_XXX_R_A?: number | null
          mu_temporalis_NL_XXX_L_M?: number | null
          mu_temporalis_NR_XXX_L_M?: number | null
          mu_trapezius_NN_SXX_D_U?: number | null
          mu_trapezius_NN_SXX_L_M?: number | null
        }
        Relationships: []
      }
      kitcoloroverrides: {
        Row: {
          fontcolor1b: number | null
          fontcolor1g: number | null
          fontcolor1r: number | null
          fontcolor2b: string | null
          fontcolor2g: string | null
          fontcolor2r: string | null
          teamcolor1b: number | null
          teamcolor1g: number | null
          teamcolor1r: number | null
          teamcolor2b: number | null
          teamcolor2g: number | null
          teamcolor2r: number | null
          teamcolor3b: number | null
          teamcolor3g: number | null
          teamcolor3r: number | null
          teamkitid: number | null
        }
        Insert: {
          fontcolor1b?: number | null
          fontcolor1g?: number | null
          fontcolor1r?: number | null
          fontcolor2b?: string | null
          fontcolor2g?: string | null
          fontcolor2r?: string | null
          teamcolor1b?: number | null
          teamcolor1g?: number | null
          teamcolor1r?: number | null
          teamcolor2b?: number | null
          teamcolor2g?: number | null
          teamcolor2r?: number | null
          teamcolor3b?: number | null
          teamcolor3g?: number | null
          teamcolor3r?: number | null
          teamkitid?: number | null
        }
        Update: {
          fontcolor1b?: number | null
          fontcolor1g?: number | null
          fontcolor1r?: number | null
          fontcolor2b?: string | null
          fontcolor2g?: string | null
          fontcolor2r?: string | null
          teamcolor1b?: number | null
          teamcolor1g?: number | null
          teamcolor1r?: number | null
          teamcolor2b?: number | null
          teamcolor2g?: number | null
          teamcolor2r?: number | null
          teamcolor3b?: number | null
          teamcolor3g?: number | null
          teamcolor3r?: number | null
          teamkitid?: number | null
        }
        Relationships: []
      }
      kitremapping: {
        Row: {
          customcrestassetid: string | null
          fromteamkittypetechid: string | null
          fromteamtechid: string | null
          fromyear: string | null
          iscustom: string | null
          toteamkittypetechid: string | null
          toteamtechid: string | null
          toyear: string | null
        }
        Insert: {
          customcrestassetid?: string | null
          fromteamkittypetechid?: string | null
          fromteamtechid?: string | null
          fromyear?: string | null
          iscustom?: string | null
          toteamkittypetechid?: string | null
          toteamtechid?: string | null
          toyear?: string | null
        }
        Update: {
          customcrestassetid?: string | null
          fromteamkittypetechid?: string | null
          fromteamtechid?: string | null
          fromyear?: string | null
          iscustom?: string | null
          toteamkittypetechid?: string | null
          toteamtechid?: string | null
          toyear?: string | null
        }
        Relationships: []
      }
      linecolor: {
        Row: {
          assetid: number | null
          attr1: string | null
          attr2: string | null
          attr3: string | null
          attr4: string | null
          attr5: string | null
          halstring: string | null
          id: string | null
          name: string | null
          primarycolor: string | null
          secondarycolor: string | null
        }
        Insert: {
          assetid?: number | null
          attr1?: string | null
          attr2?: string | null
          attr3?: string | null
          attr4?: string | null
          attr5?: string | null
          halstring?: string | null
          id?: string | null
          name?: string | null
          primarycolor?: string | null
          secondarycolor?: string | null
        }
        Update: {
          assetid?: number | null
          attr1?: string | null
          attr2?: string | null
          attr3?: string | null
          attr4?: string | null
          attr5?: string | null
          halstring?: string | null
          id?: string | null
          name?: string | null
          primarycolor?: string | null
          secondarycolor?: string | null
        }
        Relationships: []
      }
      mascot: {
        Row: {
          gender: string | null
          height: number | null
          index: string | null
          jerseyname: string | null
          jerseynamevisible: number | null
          jerseynumber: string | null
          kittype: string | null
          kityear: string | null
          mascotid: number | null
          outfitid: number | null
          teamid: number | null
          teamidwomens: number | null
        }
        Insert: {
          gender?: string | null
          height?: number | null
          index?: string | null
          jerseyname?: string | null
          jerseynamevisible?: number | null
          jerseynumber?: string | null
          kittype?: string | null
          kityear?: string | null
          mascotid?: number | null
          outfitid?: number | null
          teamid?: number | null
          teamidwomens?: number | null
        }
        Update: {
          gender?: string | null
          height?: number | null
          index?: string | null
          jerseyname?: string | null
          jerseynamevisible?: number | null
          jerseynumber?: string | null
          kittype?: string | null
          kityear?: string | null
          mascotid?: number | null
          outfitid?: number | null
          teamid?: number | null
          teamidwomens?: number | null
        }
        Relationships: []
      }
      matchscenarios: {
        Row: {
          awayid: number | null
          awayleagueid: number | null
          awaysquadtype: string | null
          ballid: number | null
          competitionid: number | null
          gametype: string | null
          gametypesetting: number | null
          halflength: number | null
          hassettings: string | null
          homeid: number | null
          homeleagueid: number | null
          homesquadtype: string | null
          scenarioid: number | null
          season: number | null
          squadtype: string | null
          stadiumid: number | null
          timeofday: number | null
          userside: string | null
          weather: number | null
        }
        Insert: {
          awayid?: number | null
          awayleagueid?: number | null
          awaysquadtype?: string | null
          ballid?: number | null
          competitionid?: number | null
          gametype?: string | null
          gametypesetting?: number | null
          halflength?: number | null
          hassettings?: string | null
          homeid?: number | null
          homeleagueid?: number | null
          homesquadtype?: string | null
          scenarioid?: number | null
          season?: number | null
          squadtype?: string | null
          stadiumid?: number | null
          timeofday?: number | null
          userside?: string | null
          weather?: number | null
        }
        Update: {
          awayid?: number | null
          awayleagueid?: number | null
          awaysquadtype?: string | null
          ballid?: number | null
          competitionid?: number | null
          gametype?: string | null
          gametypesetting?: number | null
          halflength?: number | null
          hassettings?: string | null
          homeid?: number | null
          homeleagueid?: number | null
          homesquadtype?: string | null
          scenarioid?: number | null
          season?: number | null
          squadtype?: string | null
          stadiumid?: number | null
          timeofday?: number | null
          userside?: string | null
          weather?: number | null
        }
        Relationships: []
      }
      mentalities: {
        Row: {
          activetactic: string | null
          buildupplay: string | null
          chancecreation: string | null
          code: string | null
          defensivedepth: number | null
          defensivestyle: string | null
          defensivewidth: number | null
          formationaudioid: number | null
          formationfullnameid: number | null
          mentalityid: string | null
          name: string | null
          offensivestyle: string | null
          offensivewidth: number | null
          offset0x: string | null
          offset0y: string | null
          offset10x: string | null
          offset10y: string | null
          offset1x: string | null
          offset1y: string | null
          offset2x: string | null
          offset2y: string | null
          offset3x: string | null
          offset3y: string | null
          offset4x: string | null
          offset4y: string | null
          offset5x: string | null
          offset5y: string | null
          offset6x: string | null
          offset6y: string | null
          offset7x: string | null
          offset7y: string | null
          offset8x: string | null
          offset8y: string | null
          offset9x: string | null
          offset9y: string | null
          playerid0: string | null
          playerid1: string | null
          playerid10: string | null
          playerid2: string | null
          playerid3: string | null
          playerid4: string | null
          playerid5: string | null
          playerid6: string | null
          playerid7: string | null
          playerid8: string | null
          playerid9: string | null
          playersinboxcorner: string | null
          playersinboxcross: string | null
          playersinboxfk: string | null
          pos0role: string | null
          pos10role: string | null
          pos1role: string | null
          pos2role: string | null
          pos3role: string | null
          pos4role: string | null
          pos5role: string | null
          pos6role: string | null
          pos7role: string | null
          pos8role: string | null
          pos9role: string | null
          position0: string | null
          position1: string | null
          position10: string | null
          position2: string | null
          position3: string | null
          position4: string | null
          position5: string | null
          position6: string | null
          position7: string | null
          position8: string | null
          position9: string | null
          presetid: string | null
          profileid: number | null
          sourceformationid: string | null
          teamid: string | null
          teamsheetid: number | null
        }
        Insert: {
          activetactic?: string | null
          buildupplay?: string | null
          chancecreation?: string | null
          code?: string | null
          defensivedepth?: number | null
          defensivestyle?: string | null
          defensivewidth?: number | null
          formationaudioid?: number | null
          formationfullnameid?: number | null
          mentalityid?: string | null
          name?: string | null
          offensivestyle?: string | null
          offensivewidth?: number | null
          offset0x?: string | null
          offset0y?: string | null
          offset10x?: string | null
          offset10y?: string | null
          offset1x?: string | null
          offset1y?: string | null
          offset2x?: string | null
          offset2y?: string | null
          offset3x?: string | null
          offset3y?: string | null
          offset4x?: string | null
          offset4y?: string | null
          offset5x?: string | null
          offset5y?: string | null
          offset6x?: string | null
          offset6y?: string | null
          offset7x?: string | null
          offset7y?: string | null
          offset8x?: string | null
          offset8y?: string | null
          offset9x?: string | null
          offset9y?: string | null
          playerid0?: string | null
          playerid1?: string | null
          playerid10?: string | null
          playerid2?: string | null
          playerid3?: string | null
          playerid4?: string | null
          playerid5?: string | null
          playerid6?: string | null
          playerid7?: string | null
          playerid8?: string | null
          playerid9?: string | null
          playersinboxcorner?: string | null
          playersinboxcross?: string | null
          playersinboxfk?: string | null
          pos0role?: string | null
          pos10role?: string | null
          pos1role?: string | null
          pos2role?: string | null
          pos3role?: string | null
          pos4role?: string | null
          pos5role?: string | null
          pos6role?: string | null
          pos7role?: string | null
          pos8role?: string | null
          pos9role?: string | null
          position0?: string | null
          position1?: string | null
          position10?: string | null
          position2?: string | null
          position3?: string | null
          position4?: string | null
          position5?: string | null
          position6?: string | null
          position7?: string | null
          position8?: string | null
          position9?: string | null
          presetid?: string | null
          profileid?: number | null
          sourceformationid?: string | null
          teamid?: string | null
          teamsheetid?: number | null
        }
        Update: {
          activetactic?: string | null
          buildupplay?: string | null
          chancecreation?: string | null
          code?: string | null
          defensivedepth?: number | null
          defensivestyle?: string | null
          defensivewidth?: number | null
          formationaudioid?: number | null
          formationfullnameid?: number | null
          mentalityid?: string | null
          name?: string | null
          offensivestyle?: string | null
          offensivewidth?: number | null
          offset0x?: string | null
          offset0y?: string | null
          offset10x?: string | null
          offset10y?: string | null
          offset1x?: string | null
          offset1y?: string | null
          offset2x?: string | null
          offset2y?: string | null
          offset3x?: string | null
          offset3y?: string | null
          offset4x?: string | null
          offset4y?: string | null
          offset5x?: string | null
          offset5y?: string | null
          offset6x?: string | null
          offset6y?: string | null
          offset7x?: string | null
          offset7y?: string | null
          offset8x?: string | null
          offset8y?: string | null
          offset9x?: string | null
          offset9y?: string | null
          playerid0?: string | null
          playerid1?: string | null
          playerid10?: string | null
          playerid2?: string | null
          playerid3?: string | null
          playerid4?: string | null
          playerid5?: string | null
          playerid6?: string | null
          playerid7?: string | null
          playerid8?: string | null
          playerid9?: string | null
          playersinboxcorner?: string | null
          playersinboxcross?: string | null
          playersinboxfk?: string | null
          pos0role?: string | null
          pos10role?: string | null
          pos1role?: string | null
          pos2role?: string | null
          pos3role?: string | null
          pos4role?: string | null
          pos5role?: string | null
          pos6role?: string | null
          pos7role?: string | null
          pos8role?: string | null
          pos9role?: string | null
          position0?: string | null
          position1?: string | null
          position10?: string | null
          position2?: string | null
          position3?: string | null
          position4?: string | null
          position5?: string | null
          position6?: string | null
          position7?: string | null
          position8?: string | null
          position9?: string | null
          presetid?: string | null
          profileid?: number | null
          sourceformationid?: string | null
          teamid?: string | null
          teamsheetid?: number | null
        }
        Relationships: []
      }
      mls_group_structure: {
        Row: {
          groupid: number | null
          teamid: number | null
        }
        Insert: {
          groupid?: number | null
          teamid?: number | null
        }
        Update: {
          groupid?: number | null
          teamid?: number | null
        }
        Relationships: []
      }
      netpattern: {
        Row: {
          id: number | null
          name: string | null
          netpatternid: string | null
          type: number | null
        }
        Insert: {
          id?: number | null
          name?: string | null
          netpatternid?: string | null
          type?: number | null
        }
        Update: {
          id?: number | null
          name?: string | null
          netpatternid?: string | null
          type?: number | null
        }
        Relationships: []
      }
      persistent_events: {
        Row: {
          compobjid: string | null
          eventdate: string | null
          eventid: string | null
          id: string | null
          miscvalue: string | null
          player1id: string | null
          team1id: string | null
          team2id: string | null
        }
        Insert: {
          compobjid?: string | null
          eventdate?: string | null
          eventid?: string | null
          id?: string | null
          miscvalue?: string | null
          player1id?: string | null
          team1id?: string | null
          team2id?: string | null
        }
        Update: {
          compobjid?: string | null
          eventdate?: string | null
          eventid?: string | null
          id?: string | null
          miscvalue?: string | null
          player1id?: string | null
          team1id?: string | null
          team2id?: string | null
        }
        Relationships: []
      }
      playeroutfitlinks: {
        Row: {
          outfitid: string | null
          playerid: string | null
        }
        Insert: {
          outfitid?: string | null
          playerid?: string | null
        }
        Update: {
          outfitid?: string | null
          playerid?: string | null
        }
        Relationships: []
      }
      playerperks: {
        Row: {
          perk_0: string | null
          perk_1: string | null
          perk_2: string | null
          playerperks_artificialkey: string | null
          playerperks_playerid: string | null
        }
        Insert: {
          perk_0?: string | null
          perk_1?: string | null
          perk_2?: string | null
          playerperks_artificialkey?: string | null
          playerperks_playerid?: string | null
        }
        Update: {
          perk_0?: string | null
          perk_1?: string | null
          perk_2?: string | null
          playerperks_artificialkey?: string | null
          playerperks_playerid?: string | null
        }
        Relationships: []
      }
      scenarioevents: {
        Row: {
          eventid: string | null
          minute: string | null
          playerid: string | null
          scenarioid: string | null
          side: string | null
          type: string | null
        }
        Insert: {
          eventid?: string | null
          minute?: string | null
          playerid?: string | null
          scenarioid?: string | null
          side?: string | null
          type?: string | null
        }
        Update: {
          eventid?: string | null
          minute?: string | null
          playerid?: string | null
          scenarioid?: string | null
          side?: string | null
          type?: string | null
        }
        Relationships: []
      }
      scenariosettings: {
        Row: {
          awaypossesion: string | null
          awayscore: string | null
          balllocation: string | null
          ballpositionx: string | null
          ballpositiony: string | null
          endhalf: string | null
          hasplaysettings: string | null
          homepossesion: string | null
          homescore: string | null
          injurytime: string | null
          inputdelay: string | null
          playerinpossesion: string | null
          scenarioid: string | null
          starthalf: string | null
          startminute: string | null
          teaminpossesion: string | null
        }
        Insert: {
          awaypossesion?: string | null
          awayscore?: string | null
          balllocation?: string | null
          ballpositionx?: string | null
          ballpositiony?: string | null
          endhalf?: string | null
          hasplaysettings?: string | null
          homepossesion?: string | null
          homescore?: string | null
          injurytime?: string | null
          inputdelay?: string | null
          playerinpossesion?: string | null
          scenarioid?: string | null
          starthalf?: string | null
          startminute?: string | null
          teaminpossesion?: string | null
        }
        Update: {
          awaypossesion?: string | null
          awayscore?: string | null
          balllocation?: string | null
          ballpositionx?: string | null
          ballpositiony?: string | null
          endhalf?: string | null
          hasplaysettings?: string | null
          homepossesion?: string | null
          homescore?: string | null
          injurytime?: string | null
          inputdelay?: string | null
          playerinpossesion?: string | null
          scenarioid?: string | null
          starthalf?: string | null
          startminute?: string | null
          teaminpossesion?: string | null
        }
        Relationships: []
      }
      ssfstadiums: {
        Row: {
          availablesquads: number | null
          defaultwallvalue: number | null
          iswalleditable: string | null
          name: string | null
          stadiumid: number | null
        }
        Insert: {
          availablesquads?: number | null
          defaultwallvalue?: number | null
          iswalleditable?: string | null
          name?: string | null
          stadiumid?: number | null
        }
        Update: {
          availablesquads?: number | null
          defaultwallvalue?: number | null
          iswalleditable?: string | null
          name?: string | null
          stadiumid?: number | null
        }
        Relationships: []
      }
      stadiumassignments: {
        Row: {
          stadiumcustomname: string | null
          teamid: string | null
        }
        Insert: {
          stadiumcustomname?: string | null
          teamid?: string | null
        }
        Update: {
          stadiumcustomname?: string | null
          teamid?: string | null
        }
        Relationships: []
      }
      stadiumcolor: {
        Row: {
          colorvalue1: string | null
          colorvalue2: string | null
          id: string | null
          name: string | null
          type: string | null
        }
        Insert: {
          colorvalue1?: string | null
          colorvalue2?: string | null
          id?: string | null
          name?: string | null
          type?: string | null
        }
        Update: {
          colorvalue1?: string | null
          colorvalue2?: string | null
          id?: string | null
          name?: string | null
          type?: string | null
        }
        Relationships: []
      }
      teamkithudvalues: {
        Row: {
          kittype: string | null
          pattern: number | null
          teamid: number | null
          teamkitid: number | null
        }
        Insert: {
          kittype?: string | null
          pattern?: number | null
          teamid?: number | null
          teamkitid?: number | null
        }
        Update: {
          kittype?: string | null
          pattern?: number | null
          teamid?: number | null
          teamkitid?: number | null
        }
        Relationships: []
      }
      teamsheets: {
        Row: {
          captainid: string | null
          cksupport1: string | null
          cksupport2: string | null
          cksupport3: string | null
          customsub0in: string | null
          customsub0out: string | null
          customsub1in: string | null
          customsub1out: string | null
          customsub2in: string | null
          customsub2out: string | null
          isfavourite: string | null
          leftcornerkicktakerid: string | null
          leftfreekicktakerid: string | null
          longkicktakerid: string | null
          penaltytakerid: string | null
          playerid0: string | null
          playerid1: string | null
          playerid10: string | null
          playerid11: string | null
          playerid12: string | null
          playerid13: string | null
          playerid14: string | null
          playerid15: string | null
          playerid16: string | null
          playerid17: string | null
          playerid18: string | null
          playerid19: string | null
          playerid2: string | null
          playerid20: string | null
          playerid21: string | null
          playerid22: string | null
          playerid23: string | null
          playerid24: string | null
          playerid25: string | null
          playerid26: string | null
          playerid27: string | null
          playerid28: string | null
          playerid29: string | null
          playerid3: string | null
          playerid30: string | null
          playerid31: string | null
          playerid32: string | null
          playerid33: string | null
          playerid34: string | null
          playerid35: string | null
          playerid36: string | null
          playerid37: string | null
          playerid38: string | null
          playerid39: string | null
          playerid4: string | null
          playerid40: string | null
          playerid41: string | null
          playerid42: string | null
          playerid43: string | null
          playerid44: string | null
          playerid45: string | null
          playerid46: string | null
          playerid47: string | null
          playerid48: string | null
          playerid49: string | null
          playerid5: string | null
          playerid50: string | null
          playerid51: string | null
          playerid6: string | null
          playerid7: string | null
          playerid8: string | null
          playerid9: string | null
          profileid: number | null
          rightcornerkicktakerid: string | null
          rightfreekicktakerid: string | null
          sourceformationid: string | null
          teamid: string | null
          teamsheetid: string | null
          teamsheetname: string | null
        }
        Insert: {
          captainid?: string | null
          cksupport1?: string | null
          cksupport2?: string | null
          cksupport3?: string | null
          customsub0in?: string | null
          customsub0out?: string | null
          customsub1in?: string | null
          customsub1out?: string | null
          customsub2in?: string | null
          customsub2out?: string | null
          isfavourite?: string | null
          leftcornerkicktakerid?: string | null
          leftfreekicktakerid?: string | null
          longkicktakerid?: string | null
          penaltytakerid?: string | null
          playerid0?: string | null
          playerid1?: string | null
          playerid10?: string | null
          playerid11?: string | null
          playerid12?: string | null
          playerid13?: string | null
          playerid14?: string | null
          playerid15?: string | null
          playerid16?: string | null
          playerid17?: string | null
          playerid18?: string | null
          playerid19?: string | null
          playerid2?: string | null
          playerid20?: string | null
          playerid21?: string | null
          playerid22?: string | null
          playerid23?: string | null
          playerid24?: string | null
          playerid25?: string | null
          playerid26?: string | null
          playerid27?: string | null
          playerid28?: string | null
          playerid29?: string | null
          playerid3?: string | null
          playerid30?: string | null
          playerid31?: string | null
          playerid32?: string | null
          playerid33?: string | null
          playerid34?: string | null
          playerid35?: string | null
          playerid36?: string | null
          playerid37?: string | null
          playerid38?: string | null
          playerid39?: string | null
          playerid4?: string | null
          playerid40?: string | null
          playerid41?: string | null
          playerid42?: string | null
          playerid43?: string | null
          playerid44?: string | null
          playerid45?: string | null
          playerid46?: string | null
          playerid47?: string | null
          playerid48?: string | null
          playerid49?: string | null
          playerid5?: string | null
          playerid50?: string | null
          playerid51?: string | null
          playerid6?: string | null
          playerid7?: string | null
          playerid8?: string | null
          playerid9?: string | null
          profileid?: number | null
          rightcornerkicktakerid?: string | null
          rightfreekicktakerid?: string | null
          sourceformationid?: string | null
          teamid?: string | null
          teamsheetid?: string | null
          teamsheetname?: string | null
        }
        Update: {
          captainid?: string | null
          cksupport1?: string | null
          cksupport2?: string | null
          cksupport3?: string | null
          customsub0in?: string | null
          customsub0out?: string | null
          customsub1in?: string | null
          customsub1out?: string | null
          customsub2in?: string | null
          customsub2out?: string | null
          isfavourite?: string | null
          leftcornerkicktakerid?: string | null
          leftfreekicktakerid?: string | null
          longkicktakerid?: string | null
          penaltytakerid?: string | null
          playerid0?: string | null
          playerid1?: string | null
          playerid10?: string | null
          playerid11?: string | null
          playerid12?: string | null
          playerid13?: string | null
          playerid14?: string | null
          playerid15?: string | null
          playerid16?: string | null
          playerid17?: string | null
          playerid18?: string | null
          playerid19?: string | null
          playerid2?: string | null
          playerid20?: string | null
          playerid21?: string | null
          playerid22?: string | null
          playerid23?: string | null
          playerid24?: string | null
          playerid25?: string | null
          playerid26?: string | null
          playerid27?: string | null
          playerid28?: string | null
          playerid29?: string | null
          playerid3?: string | null
          playerid30?: string | null
          playerid31?: string | null
          playerid32?: string | null
          playerid33?: string | null
          playerid34?: string | null
          playerid35?: string | null
          playerid36?: string | null
          playerid37?: string | null
          playerid38?: string | null
          playerid39?: string | null
          playerid4?: string | null
          playerid40?: string | null
          playerid41?: string | null
          playerid42?: string | null
          playerid43?: string | null
          playerid44?: string | null
          playerid45?: string | null
          playerid46?: string | null
          playerid47?: string | null
          playerid48?: string | null
          playerid49?: string | null
          playerid5?: string | null
          playerid50?: string | null
          playerid51?: string | null
          playerid6?: string | null
          playerid7?: string | null
          playerid8?: string | null
          playerid9?: string | null
          profileid?: number | null
          rightcornerkicktakerid?: string | null
          rightfreekicktakerid?: string | null
          sourceformationid?: string | null
          teamid?: string | null
          teamsheetid?: string | null
          teamsheetname?: string | null
        }
        Relationships: []
      }
      temp_createplayer: {
        Row: {
          celebrationid: string | null
          commentaryid: string | null
          cpattributename_brow_colour: string | null
          cpattributename_brow_style: string | null
          cpattributename_eye_colour: string | null
          cpattributename_facial_hair_colour: string | null
          cpattributename_facial_hair_style: string | null
          cpattributename_hair_colour: string | null
          cpattributename_hair_style: string | null
          cpmorhpcomposite_chin_deatil_rsy: string | null
          cpmorhpcomposite_chin_postion_lsy: string | null
          cpmorhpcomposite_chin_protrusion_rsx: string | null
          cpmorhpcomposite_chin_width_lsx: string | null
          cpmorphcomposite_browplacement_position_lsy: string | null
          cpmorphcomposite_browplacement_protrusion_rsx: string | null
          cpmorphcomposite_browplacement_thickness_rsy: string | null
          cpmorphcomposite_browplacement_tilt_lsx: string | null
          cpmorphcomposite_browshape_protrusion_rsx: string | null
          cpmorphcomposite_browshape_seperation_lsx: string | null
          cpmorphcomposite_browshape_thickness_rsy: string | null
          cpmorphcomposite_browshape_tilt_lsy: string | null
          cpmorphcomposite_cheekplacement_position_lsy: string | null
          cpmorphcomposite_cheekplacement_width_lsx: string | null
          cpmorphcomposite_cheekstyle_blemishes_rsx: string | null
          cpmorphcomposite_cheekstyle_style_lsx: string | null
          cpmorphcomposite_dimpledarkness_lsx: string | null
          cpmorphcomposite_earplacement_height_lsy: string | null
          cpmorphcomposite_earplacement_protrusion_lsx: string | null
          cpmorphcomposite_earstyle_lobe_lsx: string | null
          cpmorphcomposite_eyedetail1_folds_lsy: string | null
          cpmorphcomposite_eyedetail1_protrusion_rsx: string | null
          cpmorphcomposite_eyedetail1_symmetry_lsx: string | null
          cpmorphcomposite_eyedetail2_lowerlid_lsx: string | null
          cpmorphcomposite_eyedetail2_protrusion_rsy: string | null
          cpmorphcomposite_eyedetail2_upperlid_lsy: string | null
          cpmorphcomposite_eyeshape_height_lsy: string | null
          cpmorphcomposite_eyeshape_seperation_lsx: string | null
          cpmorphcomposite_eyeshape_shape_rsx: string | null
          cpmorphcomposite_eyeshape_tilt_rsy: string | null
          cpmorphcomposite_jaw_bulk_rsx: string | null
          cpmorphcomposite_jaw_position_lsy: string | null
          cpmorphcomposite_jaw_width_lsx: string | null
          cpmorphcomposite_laughlinedarkness_lsx: string | null
          cpmorphcomposite_lips_lowerlip_thickness_rsx: string | null
          cpmorphcomposite_lips_lowerlip_thickness_rsy: string | null
          cpmorphcomposite_lips_upperlip_shape_lsx: string | null
          cpmorphcomposite_lips_upperlip_thickness_lsy: string | null
          cpmorphcomposite_lipstyle_corners_leftright_lsx: string | null
          cpmorphcomposite_lipstyle_corners_lipdimple_rsx: string | null
          cpmorphcomposite_lipstyle_corners_updown_lsy: string | null
          cpmorphcomposite_mouthblemishes_lsx: string | null
          cpmorphcomposite_mouthposition_bite_rsy: string | null
          cpmorphcomposite_mouthposition_position_lsy: string | null
          cpmorphcomposite_mouthposition_protrusion_rsx: string | null
          cpmorphcomposite_mouthposition_width_lsx: string | null
          cpmorphcomposite_noseplacement_position_lsy: string | null
          cpmorphcomposite_noseplacement_position_rsy: string | null
          cpmorphcomposite_noseplacement_width_lsx: string | null
          cpmorphcomposite_noseplacement_width_rsx: string | null
          cpmorphcomposite_noseprofile_protrusion_lsx: string | null
          cpmorphcomposite_noseprofile_shape_lsy: string | null
          cpmorphcomposite_noseprofile_tipprotrusion_rsx: string | null
          cpmorphcomposite_noseprofile_tipshape_rsy: string | null
          cpmorphcomposite_nosestyle_nosestyle_lsx: string | null
          cpmorphcomposite_nostrildetail_height_lsy: string | null
          cpmorphcomposite_nostrildetail_width_lsx: string | null
          cpmorphcomposite_nostrils_height_lsy: string | null
          cpmorphcomposite_nostrils_width_lsx: string | null
          create_artificialkey: string | null
          create_originalplayerid: string | null
          create_playerid: string | null
        }
        Insert: {
          celebrationid?: string | null
          commentaryid?: string | null
          cpattributename_brow_colour?: string | null
          cpattributename_brow_style?: string | null
          cpattributename_eye_colour?: string | null
          cpattributename_facial_hair_colour?: string | null
          cpattributename_facial_hair_style?: string | null
          cpattributename_hair_colour?: string | null
          cpattributename_hair_style?: string | null
          cpmorhpcomposite_chin_deatil_rsy?: string | null
          cpmorhpcomposite_chin_postion_lsy?: string | null
          cpmorhpcomposite_chin_protrusion_rsx?: string | null
          cpmorhpcomposite_chin_width_lsx?: string | null
          cpmorphcomposite_browplacement_position_lsy?: string | null
          cpmorphcomposite_browplacement_protrusion_rsx?: string | null
          cpmorphcomposite_browplacement_thickness_rsy?: string | null
          cpmorphcomposite_browplacement_tilt_lsx?: string | null
          cpmorphcomposite_browshape_protrusion_rsx?: string | null
          cpmorphcomposite_browshape_seperation_lsx?: string | null
          cpmorphcomposite_browshape_thickness_rsy?: string | null
          cpmorphcomposite_browshape_tilt_lsy?: string | null
          cpmorphcomposite_cheekplacement_position_lsy?: string | null
          cpmorphcomposite_cheekplacement_width_lsx?: string | null
          cpmorphcomposite_cheekstyle_blemishes_rsx?: string | null
          cpmorphcomposite_cheekstyle_style_lsx?: string | null
          cpmorphcomposite_dimpledarkness_lsx?: string | null
          cpmorphcomposite_earplacement_height_lsy?: string | null
          cpmorphcomposite_earplacement_protrusion_lsx?: string | null
          cpmorphcomposite_earstyle_lobe_lsx?: string | null
          cpmorphcomposite_eyedetail1_folds_lsy?: string | null
          cpmorphcomposite_eyedetail1_protrusion_rsx?: string | null
          cpmorphcomposite_eyedetail1_symmetry_lsx?: string | null
          cpmorphcomposite_eyedetail2_lowerlid_lsx?: string | null
          cpmorphcomposite_eyedetail2_protrusion_rsy?: string | null
          cpmorphcomposite_eyedetail2_upperlid_lsy?: string | null
          cpmorphcomposite_eyeshape_height_lsy?: string | null
          cpmorphcomposite_eyeshape_seperation_lsx?: string | null
          cpmorphcomposite_eyeshape_shape_rsx?: string | null
          cpmorphcomposite_eyeshape_tilt_rsy?: string | null
          cpmorphcomposite_jaw_bulk_rsx?: string | null
          cpmorphcomposite_jaw_position_lsy?: string | null
          cpmorphcomposite_jaw_width_lsx?: string | null
          cpmorphcomposite_laughlinedarkness_lsx?: string | null
          cpmorphcomposite_lips_lowerlip_thickness_rsx?: string | null
          cpmorphcomposite_lips_lowerlip_thickness_rsy?: string | null
          cpmorphcomposite_lips_upperlip_shape_lsx?: string | null
          cpmorphcomposite_lips_upperlip_thickness_lsy?: string | null
          cpmorphcomposite_lipstyle_corners_leftright_lsx?: string | null
          cpmorphcomposite_lipstyle_corners_lipdimple_rsx?: string | null
          cpmorphcomposite_lipstyle_corners_updown_lsy?: string | null
          cpmorphcomposite_mouthblemishes_lsx?: string | null
          cpmorphcomposite_mouthposition_bite_rsy?: string | null
          cpmorphcomposite_mouthposition_position_lsy?: string | null
          cpmorphcomposite_mouthposition_protrusion_rsx?: string | null
          cpmorphcomposite_mouthposition_width_lsx?: string | null
          cpmorphcomposite_noseplacement_position_lsy?: string | null
          cpmorphcomposite_noseplacement_position_rsy?: string | null
          cpmorphcomposite_noseplacement_width_lsx?: string | null
          cpmorphcomposite_noseplacement_width_rsx?: string | null
          cpmorphcomposite_noseprofile_protrusion_lsx?: string | null
          cpmorphcomposite_noseprofile_shape_lsy?: string | null
          cpmorphcomposite_noseprofile_tipprotrusion_rsx?: string | null
          cpmorphcomposite_noseprofile_tipshape_rsy?: string | null
          cpmorphcomposite_nosestyle_nosestyle_lsx?: string | null
          cpmorphcomposite_nostrildetail_height_lsy?: string | null
          cpmorphcomposite_nostrildetail_width_lsx?: string | null
          cpmorphcomposite_nostrils_height_lsy?: string | null
          cpmorphcomposite_nostrils_width_lsx?: string | null
          create_artificialkey?: string | null
          create_originalplayerid?: string | null
          create_playerid?: string | null
        }
        Update: {
          celebrationid?: string | null
          commentaryid?: string | null
          cpattributename_brow_colour?: string | null
          cpattributename_brow_style?: string | null
          cpattributename_eye_colour?: string | null
          cpattributename_facial_hair_colour?: string | null
          cpattributename_facial_hair_style?: string | null
          cpattributename_hair_colour?: string | null
          cpattributename_hair_style?: string | null
          cpmorhpcomposite_chin_deatil_rsy?: string | null
          cpmorhpcomposite_chin_postion_lsy?: string | null
          cpmorhpcomposite_chin_protrusion_rsx?: string | null
          cpmorhpcomposite_chin_width_lsx?: string | null
          cpmorphcomposite_browplacement_position_lsy?: string | null
          cpmorphcomposite_browplacement_protrusion_rsx?: string | null
          cpmorphcomposite_browplacement_thickness_rsy?: string | null
          cpmorphcomposite_browplacement_tilt_lsx?: string | null
          cpmorphcomposite_browshape_protrusion_rsx?: string | null
          cpmorphcomposite_browshape_seperation_lsx?: string | null
          cpmorphcomposite_browshape_thickness_rsy?: string | null
          cpmorphcomposite_browshape_tilt_lsy?: string | null
          cpmorphcomposite_cheekplacement_position_lsy?: string | null
          cpmorphcomposite_cheekplacement_width_lsx?: string | null
          cpmorphcomposite_cheekstyle_blemishes_rsx?: string | null
          cpmorphcomposite_cheekstyle_style_lsx?: string | null
          cpmorphcomposite_dimpledarkness_lsx?: string | null
          cpmorphcomposite_earplacement_height_lsy?: string | null
          cpmorphcomposite_earplacement_protrusion_lsx?: string | null
          cpmorphcomposite_earstyle_lobe_lsx?: string | null
          cpmorphcomposite_eyedetail1_folds_lsy?: string | null
          cpmorphcomposite_eyedetail1_protrusion_rsx?: string | null
          cpmorphcomposite_eyedetail1_symmetry_lsx?: string | null
          cpmorphcomposite_eyedetail2_lowerlid_lsx?: string | null
          cpmorphcomposite_eyedetail2_protrusion_rsy?: string | null
          cpmorphcomposite_eyedetail2_upperlid_lsy?: string | null
          cpmorphcomposite_eyeshape_height_lsy?: string | null
          cpmorphcomposite_eyeshape_seperation_lsx?: string | null
          cpmorphcomposite_eyeshape_shape_rsx?: string | null
          cpmorphcomposite_eyeshape_tilt_rsy?: string | null
          cpmorphcomposite_jaw_bulk_rsx?: string | null
          cpmorphcomposite_jaw_position_lsy?: string | null
          cpmorphcomposite_jaw_width_lsx?: string | null
          cpmorphcomposite_laughlinedarkness_lsx?: string | null
          cpmorphcomposite_lips_lowerlip_thickness_rsx?: string | null
          cpmorphcomposite_lips_lowerlip_thickness_rsy?: string | null
          cpmorphcomposite_lips_upperlip_shape_lsx?: string | null
          cpmorphcomposite_lips_upperlip_thickness_lsy?: string | null
          cpmorphcomposite_lipstyle_corners_leftright_lsx?: string | null
          cpmorphcomposite_lipstyle_corners_lipdimple_rsx?: string | null
          cpmorphcomposite_lipstyle_corners_updown_lsy?: string | null
          cpmorphcomposite_mouthblemishes_lsx?: string | null
          cpmorphcomposite_mouthposition_bite_rsy?: string | null
          cpmorphcomposite_mouthposition_position_lsy?: string | null
          cpmorphcomposite_mouthposition_protrusion_rsx?: string | null
          cpmorphcomposite_mouthposition_width_lsx?: string | null
          cpmorphcomposite_noseplacement_position_lsy?: string | null
          cpmorphcomposite_noseplacement_position_rsy?: string | null
          cpmorphcomposite_noseplacement_width_lsx?: string | null
          cpmorphcomposite_noseplacement_width_rsx?: string | null
          cpmorphcomposite_noseprofile_protrusion_lsx?: string | null
          cpmorphcomposite_noseprofile_shape_lsy?: string | null
          cpmorphcomposite_noseprofile_tipprotrusion_rsx?: string | null
          cpmorphcomposite_noseprofile_tipshape_rsy?: string | null
          cpmorphcomposite_nosestyle_nosestyle_lsx?: string | null
          cpmorphcomposite_nostrildetail_height_lsy?: string | null
          cpmorphcomposite_nostrildetail_width_lsx?: string | null
          cpmorphcomposite_nostrils_height_lsy?: string | null
          cpmorphcomposite_nostrils_width_lsx?: string | null
          create_artificialkey?: string | null
          create_originalplayerid?: string | null
          create_playerid?: string | null
        }
        Relationships: []
      }
      tifo: {
        Row: {
          assetid: string | null
          id: number | null
          name: string | null
          teamid: string | null
          type: number | null
        }
        Insert: {
          assetid?: string | null
          id?: number | null
          name?: string | null
          teamid?: string | null
          type?: number | null
        }
        Update: {
          assetid?: string | null
          id?: number | null
          name?: string | null
          teamid?: string | null
          type?: number | null
        }
        Relationships: []
      }
      turfattributesmap: {
        Row: {
          artificialkey: string | null
          attribute: number | null
          position: string | null
          priority: number | null
          turf: string | null
        }
        Insert: {
          artificialkey?: string | null
          attribute?: number | null
          position?: string | null
          priority?: number | null
          turf?: string | null
        }
        Update: {
          artificialkey?: string | null
          attribute?: number | null
          position?: string | null
          priority?: number | null
          turf?: string | null
        }
        Relationships: []
      }
      turfsquadtypemap: {
        Row: {
          artificialkey: string | null
          squadtype: number | null
          turf: string | null
        }
        Insert: {
          artificialkey?: string | null
          squadtype?: number | null
          turf?: string | null
        }
        Update: {
          artificialkey?: string | null
          squadtype?: number | null
          turf?: string | null
        }
        Relationships: []
      }
      wtlocations: {
        Row: {
          globalx: number | null
          globaly: number | null
          id: number | null
          localx: number | null
          localy: number | null
          name: string | null
          regionid: number | null
        }
        Insert: {
          globalx?: number | null
          globaly?: number | null
          id?: number | null
          localx?: number | null
          localy?: number | null
          name?: string | null
          regionid?: number | null
        }
        Update: {
          globalx?: number | null
          globaly?: number | null
          id?: number | null
          localx?: number | null
          localy?: number | null
          name?: string | null
          regionid?: number | null
        }
        Relationships: []
      }
      wtregions: {
        Row: {
          globalx: number | null
          globaly: number | null
          id: number | null
          ishub: string | null
          name: string | null
        }
        Insert: {
          globalx?: number | null
          globaly?: number | null
          id?: number | null
          ishub?: string | null
          name?: string | null
        }
        Update: {
          globalx?: number | null
          globaly?: number | null
          id?: number | null
          ishub?: string | null
          name?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const
