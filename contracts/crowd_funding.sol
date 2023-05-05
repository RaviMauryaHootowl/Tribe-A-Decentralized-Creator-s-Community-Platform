// SPDX-License-Identifier: MIT
pragma solidity ^0.8.0;

contract crowd_funding {
    uint256 deadline = 5000;
    // creator
    struct Project {
        string name;
    }

    struct Milestone {
        uint256 goal;
        uint256 fundRaised;
        uint256[] contributorsList;
        uint256 noOfContributors;
        mapping(uint256 => uint256) contributorIdToAmount;
    }

    struct Creator {
        string name;
        string category; //?
        mapping(uint256 => Project) idToProject;
        uint256 noOfProjects;
        mapping(uint256 => VotingVenture) idToVotingVenture;
        uint256 noOfVotingVentures;
        Contributor[] contributors;
        uint256 noOfContributors;
        uint256 activePoolAmount;
        // activePoolAmount = redeemableAmount + refundableAmount
        uint256 redeemableAmount; //95%
        uint256 refundableAmount; //5%
        uint256 claimAmount;
        uint256 totalFundRaised;
        Milestone currentActiveMilestone;
        uint256 noOfMilestones;
    }

    struct VotingVenture {
        bool isVentureActive;
        uint256 initiationDate;
        uint256 noOfVoters;
        uint256 upScore;
        uint256 downScore;
        mapping(address => bool) hasVoted;
        uint256 amount;
    }

    mapping(address => uint256) creatorsAddressToID;
    mapping(uint256 => Creator) idToCreators;
    uint56 noOfCreators = 0;

    //creator functions
    function RegisterCreator(
        string calldata name,
        string calldata category,
        uint256 milestoneGoal
    ) public {
        creatorsAddressToID[msg.sender] = noOfCreators;
        Creator storage creator = idToCreators[noOfCreators++];

        creator.name = name;
        creator.category = category;

        creator.noOfProjects = 0;
        creator.noOfVotingVentures = 0;
        creator.noOfContributors = 0;
        creator.activePoolAmount = 0;
        creator.redeemableAmount = 0;
        creator.refundableAmount = 0;
        creator.claimAmount = 0;
        creator.totalFundRaised = 0;
        creator.noOfMilestones = 0;

        Milestone storage milestone = creator.currentActiveMilestone;
        milestone.goal = milestoneGoal;
        milestone.fundRaised = 0;
        milestone.noOfContributors = 0;
    }

    // UploadProjects
    function UploadProject(string calldata name) public {
        //need to specify project fund ??
        uint256 id = creatorsAddressToID[msg.sender];
        Creator storage creator = idToCreators[id]; //really storage???

        Project storage newProject = creator.idToProject[creator.noOfProjects];
        newProject.name = name;
    }

    //initiate voting
    function InitiateVoting(uint256 amount) public {
        uint256 id = creatorsAddressToID[msg.sender];
        Creator storage creator = idToCreators[id];

        uint256 redeemableAmount = creator.redeemableAmount;
        require(
            amount < redeemableAmount,
            "You donot have enough redeemable amount"
        );

        VotingVenture storage previousVenture = creator.idToVotingVenture[
            creator.noOfVotingVentures
        ];
        require(
            previousVenture.isVentureActive == false,
            "A voting venture is already on going! Cannot create a new one"
        );

        VotingVenture storage venture = creator.idToVotingVenture[
            creator.noOfVotingVentures++
        ];
        venture.amount = amount;
        venture.upScore = 0;
        venture.downScore = 0; //TBD ??
        venture.initiationDate = block.timestamp;
        venture.noOfVoters = 0;
        venture.isVentureActive = true;
    }

    // ----------------------------------------------------------------
    // CREATOR
    struct Contributor {
        string name;
        uint256[] listOfIdContributedCreators;
        uint256 claimableAmount;
        uint256 noOfContibutedCreators;
        mapping(uint256 => uint256) creatorToAmount;
        mapping(uint256 => uint256) creatorIdToMembershipStrength;
    }
    mapping(address => uint256) contributorsAddressToID;
    mapping(uint256 => Contributor) idToContributor;
    uint56 noOfContributors = 0;

    function RegisterContributor(string calldata name) public {
        contributorsAddressToID[msg.sender] = noOfContributors;
        Contributor storage contributor = idToContributor[noOfContributors++];
        contributor.name = name;
        contributor.noOfContibutedCreators = 0;
        contributor.claimableAmount = 0;
    }

    function Contribute(address creatorAddress) public payable {
        require(msg.value > 0, "Gareeb?");

        uint256 amount = msg.value;
        uint256 contributorId = contributorsAddressToID[msg.sender];
        uint256 creatorId = creatorsAddressToID[creatorAddress];

        // contributor contri update @contri
        Contributor storage contributor = idToContributor[contributorId];
        contributor.listOfIdContributedCreators.push(creatorId);
        contributor.noOfContibutedCreators++;
        contributor.creatorToAmount[creatorId] += amount;

        // contributor contri update @creator
        Creator storage creator = idToCreators[creatorId];
        creator.totalFundRaised += amount;
        creator.activePoolAmount += amount;
        creator.redeemableAmount += (95 * amount) / 100;
        creator.refundableAmount += amount - creator.redeemableAmount;
        //updating milestone
        Milestone storage currentMilestone = creator.currentActiveMilestone;

        if ((currentMilestone.fundRaised + amount) < currentMilestone.goal) {
            currentMilestone.fundRaised += amount;
            currentMilestone.contributorsList.push(contributorId);
            currentMilestone.noOfContributors++;
            currentMilestone.contributorIdToAmount[contributorId] += amount;
        } else {
            uint256 amountInCurrent = currentMilestone.goal -
                currentMilestone.fundRaised;
            uint256 amountInNext = amount - amountInCurrent;

            // 1. Update current milestone
            currentMilestone.fundRaised += amountInCurrent;

            // Add contributors to list only if he doesn't exist
            if (currentMilestone.contributorIdToAmount[contributorId] == 0) {
                currentMilestone.contributorsList.push(contributorId);
                currentMilestone.noOfContributors++;
            }

            currentMilestone.contributorIdToAmount[
                contributorId
            ] += amountInCurrent;

            // 2. redeem the amount to all contributors
            for (uint256 i = 0; i < currentMilestone.noOfContributors; i++) {
                uint256 id = currentMilestone.contributorsList[i];
                idToContributor[id].claimableAmount +=
                    (currentMilestone.contributorIdToAmount[id] * 5) /
                    100;
                currentMilestone.contributorIdToAmount[id] = 0;
            }

            // 3. create new milestone / resetting the milestone
            creator.noOfMilestones++;

            currentMilestone.contributorsList = new uint256[](0);
            currentMilestone.fundRaised = amountInNext;
            currentMilestone.noOfContributors = 0;

            if (amountInNext <= 0) return;
            currentMilestone.contributorsList.push(contributorId);
            currentMilestone.contributorIdToAmount[
                contributorId
            ] = amountInNext;
            currentMilestone.noOfContributors++;
        }

        //Update Membership Strength
        // ... here ...
        contributor.creatorIdToMembershipStrength[creatorId] +=
            amount *
            creator.totalFundRaised;
    }

    function claimAmount() public payable {
        uint256 contributorId = contributorsAddressToID[msg.sender];
        Contributor storage contributor = idToContributor[contributorId];
        require(contributor.claimableAmount == 0, "Not enough fund to claim");
        address payable contributorAddress = payable(msg.sender);
        contributorAddress.transfer(contributor.claimableAmount);
        contributor.claimableAmount = 0;
    }

    function vote(address creatorAddress, bool isUpvote) public {
        // struct VotingVenture{
        //     uint256 initiationDate;
        //     uint256 noOfVoters;
        //     uint256 maxVotingScore;
        //     uint256 amount;
        //     uint256 currentVotingScore;
        //     mapping of address => bool hasVoted;
        // ------------------------------
        //     mapping (uint256=>VotingVenture) idToVotingVenture;
        //     uint256 noOfVotingVentures;

        uint256 contributorId = contributorsAddressToID[msg.sender];
        uint256 creatorId = creatorsAddressToID[creatorAddress];
        VotingVenture storage currentVoting = idToCreators[creatorId]
            .idToVotingVenture[idToCreators[creatorId].noOfVotingVentures - 1];

        require(currentVoting.isVentureActive, "Voting Venture is not active");

        // isMember
        require(
            idToContributor[contributorId].creatorIdToMembershipStrength[
                creatorId
            ] > 0
        );

        // hasNotVoted
        require(currentVoting.hasVoted[msg.sender] == false);

        // deadline check
        require(block.timestamp < currentVoting.initiationDate + deadline);

        currentVoting.hasVoted[msg.sender] = true;
        currentVoting.noOfVoters++;

        // update current voting score
        if (isUpvote) {
            currentVoting.upScore += idToContributor[contributorId]
                .creatorIdToMembershipStrength[creatorId];
        } else {
            currentVoting.downScore += idToContributor[contributorId]
                .creatorIdToMembershipStrength[creatorId];
        }

        // Update membership strength
        idToContributor[contributorId].creatorIdToMembershipStrength[
            creatorId
        ] += 1 * idToCreators[creatorId].totalFundRaised;
    }

    function getMyVotingVentureResult() public returns (bool) {
        uint256 creatorId = creatorsAddressToID[msg.sender];
        Creator storage creator = idToCreators[creatorId];
        VotingVenture storage currentVoting = creator.idToVotingVenture[
            idToCreators[creatorId].noOfVotingVentures - 1
        ];

        require(currentVoting.isVentureActive, "No active venture");

        require(
            currentVoting.noOfVoters * 2 > creator.noOfContributors,
            "Not enough voters"
        );

        if (currentVoting.upScore > currentVoting.downScore) {
            creator.claimAmount += currentVoting.amount;
            currentVoting.isVentureActive = false;
            return true;
        }
        return false;
    }

    function claimAmountForCreator() public payable {
        uint256 creatorId = creatorsAddressToID[msg.sender];
        Creator storage creator = idToCreators[creatorId];
        require(creator.claimAmount > 0, "No amount to be claimed");

        uint256 amount = creator.claimAmount;
        creator.claimAmount = 0;
        address payable payAdd = payable(msg.sender);
        payAdd.transfer(amount);
    }

    function getMemebershipStrength(
        uint256 creatorId
    ) public view returns (uint256) {
        uint256 contributorId = contributorsAddressToID[msg.sender];
        return
            idToContributor[contributorId].creatorIdToMembershipStrength[
                creatorId
            ];
    }

    function currentMilesoneNumber(
        uint256 creatorId
    ) public view returns (uint256) {
        return idToCreators[creatorId].noOfMilestones;
    }
}
