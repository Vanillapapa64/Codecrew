import axios from "axios";
import { Octokit } from "@octokit/rest";

export async function getpersonalaccesstoken(code:string){
    try {
        const baseurl= process.env.NEXTAUTH_URL
        const response= await fetch(`${baseurl}/api/getAccessToken?code=${code}`);
        const data = await response.json();
        console.log(data.token)
        return data.token
    }catch(error){
        console.error(error);
    }
}
export interface createRepo{
    token:string,
    name:string
}
export async function createRepository(x:createRepo) {
    const octokit = new Octokit({
        auth: x.token
    });
    console.log(x)
    try {
        const response = await octokit.repos.createForAuthenticatedUser({
            name: x.name,
            private: false, // Set true for private repo
        });
        return response.data
    } catch (error) {
        throw new Error("couldn't get repo")
    }
}
export interface viewcommit{
    token:string,
    name:string,
    repo:string
}
export async function listCommits(x:viewcommit) {
    const octokit = new Octokit({
        auth: x.token
    });
    try {
        const commits = await octokit.repos.listCommits({
            owner:x.name, // Repository owner username
            repo:x.repo,  // Repository name
        });
        return commits.data
    } catch (error) {
        throw new Error("couldn't get repo")
    }
}
export interface collab{
    token:string,
    owner:string,
    repo:string,
    username:string
}
export async function inviteCollaborator(x:collab) {
    const octokit = new Octokit({
        auth: x.token
    });
    console.log(x)
    
    try {
        const response = await octokit.request('PUT /repos/{owner}/{repo}/collaborators/{username}', {
            owner: x.owner,
            repo: x.repo,
            username: x.username,
            permission: 'admin',
            headers: {
              'X-GitHub-Api-Version': '2022-11-28'
            }
          })
        console.log(response)
        return (response.data);
    } catch (error:any) {
        console.log(error.response)
        throw new Error("couldn't get collab")
    }
}
export async function getCollaborators(token:string,owner:string,repo:string) {
    const octokit = new Octokit({
        auth:token, // Replace with your GitHub personal access token
      });
    console.log(token,owner,repo)
      try {
        const response = await octokit.rest.repos.listCollaborators({
          owner,
          repo,
        });
        console.log("res form gh", response)
        const collaborators = response.data;
        const collaboratorUsernames = collaborators.map((collaborator) => collaborator.login);
    
        return (collaboratorUsernames)
      } catch (error) {
        console.log(error)
        throw new Error(`Couldn't fetch collaborators: ${error}`);
      }
}