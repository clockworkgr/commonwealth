/**
 * This file was auto-generated by Fern from our API Definition.
 */
import * as CommonApi from '../../../index';
export interface CreateCommentResponseThreadCollaboratorsItem {
  id?: number;
  address: string;
  communityId: string;
  userId?: number;
  verificationToken?: string;
  verificationTokenExpires?: Date;
  verified?: Date;
  lastActive?: Date;
  ghostAddress?: boolean;
  walletId?: CommonApi.CreateCommentResponseThreadCollaboratorsItemWalletId;
  blockInfo?: string;
  isUserDefault?: boolean;
  role?: CommonApi.CreateCommentResponseThreadCollaboratorsItemRole;
  isBanned?: boolean;
  hex?: string;
  user?: CommonApi.CreateCommentResponseThreadCollaboratorsItemUser;
  createdAt?: Date;
  updatedAt?: Date;
}
