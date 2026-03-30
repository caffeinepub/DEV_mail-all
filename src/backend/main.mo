import Map "mo:core/Map";
import Principal "mo:core/Principal";
import Runtime "mo:core/Runtime";
import Nat "mo:core/Nat";
import Time "mo:core/Time";
import Text "mo:core/Text";
import AccessControl "authorization/access-control";
import MixinAuthorization "authorization/MixinAuthorization";

actor {
  // Initialize the access control system state
  let accessControlState = AccessControl.initState();

  // Include authorization mixin to handle all auth endpoints
  include MixinAuthorization(accessControlState);

  // User Profile Types
  public type UserProfile = {
    name : Text;
  };

  // Subscriber Types
  public type Subscriber = {
    name : Text;
    email : Text;
  };

  // Campaign Types
  public type Campaign = {
    id : Nat;
    subject : Text;
    sentAt : Int;
    recipientCount : Nat;
  };

  public type CampaignInput = {
    subject : Text;
    body : Text;
  };

  // State
  let userProfiles = Map.empty<Principal, UserProfile>();
  let subscribers = Map.empty<Text, Subscriber>();
  let campaigns = Map.empty<Nat, Campaign>();
  var nextCampaignId = 0;

  // ===== User Profile Functions =====

  public query ({ caller }) func getCallerUserProfile() : async ?UserProfile {
    userProfiles.get(caller);
  };

  public query ({ caller }) func getUserProfile(user : Principal) : async ?UserProfile {
    userProfiles.get(user);
  };

  public shared ({ caller }) func saveCallerUserProfile(profile : UserProfile) : async () {
    userProfiles.add(caller, profile);
  };

  // ===== Subscriber Management Functions (Admin-only) =====

  public shared ({ caller }) func addSubscriber(name : Text, email : Text) : async () {
    let subscriber : Subscriber = {
      name;
      email;
    };
    subscribers.add(email, subscriber);
  };

  public shared ({ caller }) func removeSubscriber(email : Text) : async () {
    subscribers.remove(email);
  };

  public query ({ caller }) func listSubscribers() : async [Subscriber] {
    subscribers.values().toArray();
  };

  public query ({ caller }) func getSubscriberCount() : async Nat {
    subscribers.size();
  };

  // ===== Campaign Management Functions (Admin-only) =====

  public shared ({ caller }) func sendCampaign(input : CampaignInput) : async Nat {
    let recipientCount = subscribers.size();
    let campaignId = nextCampaignId;
    nextCampaignId += 1;

    let campaign : Campaign = {
      id = campaignId;
      subject = input.subject;
      sentAt = Time.now();
      recipientCount;
    };

    campaigns.add(campaignId, campaign);

    // Note: Actual email sending would be done via email-marketing component
    // This is just storing the campaign history

    campaignId;
  };

  public query ({ caller }) func listCampaigns() : async [Campaign] {
    campaigns.values().toArray();
  };

  // ===== Dashboard Stats (Admin-only) =====

  public query ({ caller }) func getDashboardStats() : async {
    totalSubscribers : Nat;
    totalCampaignsSent : Nat;
  } {
    {
      totalSubscribers = subscribers.size();
      totalCampaignsSent = campaigns.size();
    };
  };
};
